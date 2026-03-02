require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Middleware for JSON parsing
app.use(bodyParser.json());

// Restricted AI provider/model
const RESTRICTED_AI = 'restricted-provider';

// AI Provider configurations (matching aiProviderService.ts)
const PROVIDER_CONFIGS = {
  GROQCLOUD: {
    name: 'GROQCLOUD',
    baseURL: 'https://api.groq.com',
    model: 'llama-3.3-70b-versatile',
    endpoint: '/openai/v1/chat/completions',
    envKey: 'GROQCLOUD_API_KEY',
  },
  CEREBRAS: {
    name: 'CEREBRAS',
    baseURL: 'https://api.cerebras.ai',
    model: 'llama-3.3-70b',
    endpoint: '/v1/chat/completions',
    envKey: 'CEREBRAS_API_KEY',
  },
  GROK: {
    name: 'GROK',
    baseURL: 'https://api.x.ai/v1',
    model: 'grok-2-1212',
    endpoint: '/chat/completions',
    envKey: 'GROK_API_KEY',
  },
  DEEPSEEK: {
    name: 'DEEPSEEK',
    baseURL: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    endpoint: '/chat/completions',
    envKey: 'DEEPSEEK_API_KEY',
  },
  OPENROUTER: {
    name: 'OPENROUTER',
    baseURL: 'https://openrouter.ai/api/v1',
    model: 'deepseek/deepseek-chat',
    endpoint: '/chat/completions',
    envKey: 'OPENROUTER_API_KEY',
  },
  ZAI: {
    name: 'ZAI',
    baseURL: 'https://api.z.ai',
    model: 'glm-4.7',
    endpoint: '/v1/chat/completions',
    envKey: 'ZAI_API_KEY',
  },
};

// Image Generation Provider configurations
// Fallback chain: Pollinations -> Meshy -> Cloudflare
const IMAGE_PROVIDERS = {
  POLLINATIONS: {
    name: 'POLLINATIONS',
    baseURL: 'https://gen.pollinations.ai',
    model: 'zimage', // Cheapest/fastest model (not flux/gptimage/nanobanana/grok)
    envKey: 'POLLINATIONS_API_KEY',
  },
  MESHY: {
    name: 'MESHY',
    baseURL: 'https://api.meshy.ai',
    endpoint: '/v2/text-to-image',
    model: 'preview',
    artStyle: 'realistic',
    envKey: 'MESHY_API_KEY',
  },
  CLOUDFLARE: {
    name: 'CLOUDFLARE',
    baseURL: 'https://api.cloudflare.com/client/v4',
    accountID: process.env.CLOUDFLARE_ACCOUNT_ID || '',
    endpoint: '/accounts/{account_id}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0',
    envKey: 'CLOUDFLARE_API_TOKEN',
  },
};

// Get API key from environment
function getApiKey(provider) {
  const config = PROVIDER_CONFIGS[provider.toUpperCase()] || IMAGE_PROVIDERS[provider.toUpperCase()];
  if (!config) return null;
  return process.env[config.envKey] || '';
}

// Build visual description prompt for image generation
function buildImagePrompt(request) {
  const { characterName, characterDesc, context, theme, imageSpecifics } = request;

  let prompt = '';

  // User's prompt comes FIRST for priority
  if (imageSpecifics) {
    prompt += `${imageSpecifics}. `;
  }

  // Add character details
  prompt += `${characterName}, ${characterDesc}. `;

  // Add context
  if (context) {
    prompt += `Scene: ${context.substring(0, 200)}. `;
  }

  // Add theme/style
  if (theme) {
    prompt += `Style: ${theme}. `;
  }

  return prompt.trim();
}

// Generate consistent seed from string
function generateSeedFromString(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Pollinations Image Generation (Primary - cheapest zimage model)
async function generateImagePollinations(request) {
  const apiKey = process.env.POLLINATIONS_API_KEY;
  const prompt = buildImagePrompt(request);
  const seed = request.characterImageSeed
    ? generateSeedFromString(request.characterImageSeed)
    : generateSeedFromString(request.characterName + request.characterDesc);

  const params = new URLSearchParams({
    width: '1024',
    height: '1024',
    seed: seed.toString(),
    model: 'zimage', // Cheapest model
    enhance: 'true',
  });

  const encodedPrompt = encodeURIComponent(prompt);
  const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?${params.toString()}`;

  console.log('[ImageGen] Trying Pollinations.ai with new API...');

  // Verify the image can be fetched with Bearer token
  const headers = {};
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(imageUrl, {
      method: 'HEAD',
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log('[ImageGen] Pollinations.ai succeeded');
    return { success: true, url: imageUrl, provider: 'POLLINATIONS' };
  } catch (error) {
    console.error('[ImageGen] Pollinations.ai failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Meshy Image Generation (Fallback 1)
async function generateImageMeshy(request) {
  const apiKey = process.env.MESHY_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'Meshy API key not configured' };
  }

  const prompt = buildImagePrompt(request);
  const config = IMAGE_PROVIDERS.MESHY;

  console.log('[ImageGen] Trying Meshy (fallback 1)...');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const response = await axios.post(
      `${config.baseURL}${config.endpoint}`,
      {
        prompt,
        mode: 'preview',
        art_style: config.artStyle,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    const result = response.data;
    if (result.status === 'FAILED' || result.error) {
      throw new Error(result.error || 'Meshy generation failed');
    }

    if (result.thumbnail_url) {
      console.log('[ImageGen] Meshy succeeded');
      return { success: true, url: result.thumbnail_url, provider: 'MESHY' };
    }

    // Poll for result if we have a task ID
    if (result.id) {
      return await pollMeshyResult(result.id);
    }

    throw new Error('No image URL in Meshy response');
  } catch (error) {
    console.error('[ImageGen] Meshy failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Poll Meshy for generation result
async function pollMeshyResult(taskId, maxAttempts = 10) {
  const apiKey = process.env.MESHY_API_KEY;
  const endpoint = `https://api.meshy.ai/v2/text-to-image/${taskId}`;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await axios.get(endpoint, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });

      const result = response.data;

      if (result.status === 'SUCCEEDED' && result.thumbnail_url) {
        console.log(`[ImageGen] Meshy succeeded after ${attempt + 1} polls`);
        return { success: true, url: result.thumbnail_url, provider: 'MESHY' };
      }

      if (result.status === 'FAILED') {
        throw new Error(result.error || 'Generation failed');
      }

      console.log(`[ImageGen] Meshy poll ${attempt + 1}: status=${result.status}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      if (attempt === maxAttempts - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  throw new Error('Meshy generation timed out');
}

// Cloudflare Image Generation (Fallback 2)
async function generateImageCloudflare(request) {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountID = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!apiToken || !accountID) {
    return { success: false, error: 'Cloudflare API not configured' };
  }

  const prompt = buildImagePrompt(request);

  console.log('[ImageGen] Trying Cloudflare Workers AI (fallback 2)...');

  try {
    const endpoint = IMAGE_PROVIDERS.CLOUDFLARE.endpoint.replace('{account_id}', accountID);
    const url = `${IMAGE_PROVIDERS.CLOUDFLARE.baseURL}${endpoint}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await axios.post(
      url,
      { prompt },
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    // Convert image to base64 data URL
    const base64 = Buffer.from(response.data).toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    console.log('[ImageGen] Cloudflare succeeded');
    return { success: true, url: dataUrl, provider: 'CLOUDFLARE' };
  } catch (error) {
    console.error('[ImageGen] Cloudflare failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Unified image generation with fallback
async function generateImageWithFallback(request) {
  const fallbackChain = [];
  const errors = [];

  // Try Pollinations (primary)
  fallbackChain.push('POLLINATIONS');
  const pollinationsResult = await generateImagePollinations(request);
  if (pollinationsResult.success) {
    return { ...pollinationsResult, fallbackChain };
  }
  errors.push(`Pollinations: ${pollinationsResult.error}`);

  // Try Meshy (fallback 1)
  fallbackChain.push('MESHY');
  const meshyResult = await generateImageMeshy(request);
  if (meshyResult.success) {
    return { ...meshyResult, fallbackChain };
  }
  errors.push(`Meshy: ${meshyResult.error}`);

  // Try Cloudflare (fallback 2)
  fallbackChain.push('CLOUDFLARE');
  const cloudflareResult = await generateImageCloudflare(request);
  if (cloudflareResult.success) {
    return { ...cloudflareResult, fallbackChain };
  }
  errors.push(`Cloudflare: ${cloudflareResult.error}`);

  // All failed
  return {
    success: false,
    error: `All providers failed: ${errors.join('; ')}`,
    fallbackChain,
  };
}

// MCP Discovery Endpoint
app.get('/mcp', (req, res) => {
  res.json({
    name: 'AI Proxy MCP Server',
    description: 'Forwards AI queries to selected providers via proxy with image generation fallback',
    tools: [
      {
        name: 'query_ai',
        description: 'Send a prompt to an AI provider via the proxy. Returns the response.',
        parameters: {
          type: 'object',
          properties: {
            provider: { type: 'string', description: 'AI provider (e.g., groqcloud, cerebras)' },
            model: { type: 'string', description: 'Specific model (optional, uses default if not provided)' },
            prompt: { type: 'string', description: 'The prompt to send' }
          },
          required: ['provider', 'prompt']
        }
      },
      {
        name: 'generate_image',
        description: 'Generate an image with automatic fallback (Pollinations -> Meshy -> Cloudflare)',
        parameters: {
          type: 'object',
          properties: {
            characterName: { type: 'string', description: 'Character name' },
            characterDesc: { type: 'string', description: 'Character description' },
            context: { type: 'string', description: 'Scene context' },
            theme: { type: 'string', description: 'Theme/style' },
            imageSpecifics: { type: 'string', description: 'Specific image details (optional)' },
            characterImageSeed: { type: 'string', description: 'Seed for consistency (optional)' }
          },
          required: ['characterName', 'characterDesc', 'context', 'theme']
        }
      }
    ]
  });
});

// MCP Invoke Endpoint
app.post('/mcp/invoke', async (req, res) => {
  const { tool, parameters } = req.body;

  if (tool === 'query_ai') {
    return handleQueryAi(req, res);
  } else if (tool === 'generate_image') {
    return handleGenerateImage(req, res);
  } else {
    return res.status(400).json({ error: 'Unknown tool' });
  }
});

// Handle query_ai (text generation)
async function handleQueryAi(req, res) {
  const { parameters } = req.body;
  const { provider, model, prompt } = parameters;
  const providerUpper = provider.toUpperCase();

  // Block restricted AI
  if (provider === RESTRICTED_AI || (model && model.includes(RESTRICTED_AI))) {
    return res.status(403).json({ error: 'Access to this AI is restricted via MCP' });
  }

  // Check if provider is supported
  const config = PROVIDER_CONFIGS[providerUpper];
  if (!config) {
    return res.status(400).json({ error: `Unsupported provider: ${provider}. Supported: groqcloud, cerebras, grok` });
  }

  // Get API key
  const apiKey = getApiKey(provider);
  if (!apiKey) {
    return res.status(500).json({ error: `API key not found for provider: ${provider}. Set ${config.envKey} environment variable.` });
  }

  try {
    // Make OpenAI-compatible request to the provider
    const response = await axios.post(
      `${config.baseURL}${config.endpoint}`,
      {
        model: model || config.model,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2048,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        timeout: 30000,
      }
    );

    // Extract the response text
    const responseText = response.data?.choices?.[0]?.message?.content || '';

    res.json({
      result: {
        response: responseText,
        provider: providerUpper,
        model: model || config.model,
        usage: response.data?.usage,
      }
    });
  } catch (error) {
    const errorMsg = error.response
      ? `API error ${error.response.status}: ${JSON.stringify(error.response.data)}`
      : error.message;
    res.status(500).json({ error: `Proxy error: ${errorMsg}` });
  }
}

// Handle generate_image (image generation with fallback)
async function handleGenerateImage(req, res) {
  const { parameters } = req.body;

  // Validate required fields
  const requiredFields = ['characterName', 'characterDesc', 'context', 'theme'];
  for (const field of requiredFields) {
    if (!parameters[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }

  try {
    const result = await generateImageWithFallback(parameters);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({
      result: {
        url: result.url,
        provider: result.provider,
        fallbackChain: result.fallbackChain,
      }
    });
  } catch (error) {
    res.status(500).json({ error: `Image generation error: ${error.message}` });
  }
}

// Standalone image generation endpoint (for direct API calls)
app.post('/image/generate', async (req, res) => {
  // Validate required fields
  const requiredFields = ['characterName', 'characterDesc', 'context', 'theme'];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }

  try {
    const result = await generateImageWithFallback(req.body);

    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    res.json({
      success: true,
      data: {
        url: result.url,
        provider: result.provider,
        fallbackChain: result.fallbackChain,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: `Image generation error: ${error.message}` });
  }
});

// Health check for image providers
app.get('/image/health', async (req, res) => {
  const health = {
    POLLINATIONS: false,
    MESHY: false,
    CLOUDFLARE: false,
  };

  // Check Pollinations
  try {
    const testUrl = 'https://gen.pollinations.ai/image/test?width=64&height=64&model=zimage';
    const response = await fetch(testUrl, { method: 'HEAD' });
    health.POLLINATIONS = response.ok;
  } catch (e) {
    health.POLLINATIONS = false;
  }

  // Check Meshy
  health.MESHY = !!process.env.MESHY_API_KEY;

  // Check Cloudflare
  health.CLOUDFLARE = !!(process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_ACCOUNT_ID);

  res.json(health);
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('MCP Server Running with Image Generation Fallback');
});

// Status endpoint - check which providers are configured
app.get('/status', (req, res) => {
  const status = {
    chat: {},
    image: {},
  };

  for (const [key, config] of Object.entries(PROVIDER_CONFIGS)) {
    status.chat[key] = {
      configured: !!process.env[config.envKey],
      model: config.model,
      baseURL: config.baseURL,
    };
  }

  for (const [key, config] of Object.entries(IMAGE_PROVIDERS)) {
    status.image[key] = {
      configured: !!process.env[config.envKey],
      baseURL: config.baseURL,
    };
  }

  res.json(status);
});

// ============================================================================
// API ROUTES - Compatibility layer for Somnium/ViaLogos apps
// ============================================================================

// API Key authentication middleware
const CLIENT_API_KEY = process.env.MCP_PROXY_API_KEY || 'DC_API_FBv15A4erXjE8eQXc75qbJU1WHcsw77XF27BHE';

function authenticateApiKey(req, res, next) {
  const providedKey = req.headers['x-api-key'];
  if (!providedKey || providedKey !== CLIENT_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  next();
}

// Health check endpoint with API key auth
app.get('/api/requests/health', authenticateApiKey, (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// List available providers
app.get('/api/requests/providers', authenticateApiKey, (req, res) => {
  const providers = {
    chat: [],
    image: ['POLLINATIONS', 'MESHY', 'CLOUDFLARE'],
  };

  for (const [key, config] of Object.entries(PROVIDER_CONFIGS)) {
    if (process.env[config.envKey]) {
      providers.chat.push(key);
    }
  }

  res.json({ data: { providers } });
});

// Chat completion endpoint (OpenAI-compatible format)
app.post('/api/requests/chat', authenticateApiKey, async (req, res) => {
  const { provider, messages, systemInstruction, jsonMode = false, temperature = 0.8, response_id } = req.body;

  const providerUpper = (provider || 'GROK').toUpperCase();
  const config = PROVIDER_CONFIGS[providerUpper];

  if (!config) {
    return res.status(400).json({ error: `Unsupported provider: ${provider}` });
  }

  const apiKey = getApiKey(providerUpper);
  if (!apiKey) {
    return res.status(500).json({ error: `API key not configured for provider: ${provider}` });
  }

  try {
    // Build messages array
    const apiMessages = [];
    if (systemInstruction) {
      apiMessages.push({ role: 'system', content: systemInstruction });
    }
    apiMessages.push(...messages);

    // GROK conversation continuation support
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    // GROK-specific: add response_id for conversation continuity
    let requestBody = {
      model: config.model,
      messages: apiMessages,
      temperature,
    };

    // Handle GROK's response_id for conversation continuity
    if (providerUpper === 'GROK' && response_id) {
      // For GROK with response_id, we only send the new message
      const lastUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0];
      requestBody = {
        model: config.model,
        messages: systemInstruction
          ? [{ role: 'system', content: systemInstruction }, { role: 'user', content: lastUserMessage.content }]
          : [{ role: 'user', content: lastUserMessage.content }],
        temperature,
      };
    }

    // Add jsonMode for structured output
    if (jsonMode) {
      requestBody.response_format = { type: 'json_object' };
    }

    const response = await axios.post(
      `${config.baseURL}${config.endpoint}`,
      requestBody,
      { headers, timeout: 30000 }
    );

    const responseText = response.data?.choices?.[0]?.message?.content || '';
    const grokResponseId = response.data?.id; // GROK returns an ID for conversation continuity

    res.json({
      data: {
        text: responseText,
        provider: providerUpper,
        response_id: grokResponseId,
      },
    });
  } catch (error) {
    const errorMsg = error.response
      ? `API error ${error.response.status}: ${JSON.stringify(error.response.data)}`
      : error.message;
    res.status(500).json({ error: errorMsg });
  }
});

// Image generation endpoint (ViaLogos/Somnium format)
app.post('/api/requests/image', authenticateApiKey, async (req, res) => {
  const { provider, bibleVerse, sceneContext, theme, imageSpecifics } = req.body;

  // Translate ViaLogos/Somnium format to proxy format
  const proxyRequest = {
    characterName: bibleVerse || 'Scene',
    characterDesc: sceneContext || '',
    context: sceneContext || '',
    theme: theme || 'realistic',
    imageSpecifics,
  };

  try {
    const result = await generateImageWithFallback(proxyRequest);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({
      data: {
        url: result.url,
        provider: result.provider,
      },
    });
  } catch (error) {
    res.status(500).json({ error: `Image generation error: ${error.message}` });
  }
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(port, () => {
  console.log(`MCP Server listening on port ${port}`);
  console.log(`- Chat providers: ${Object.keys(PROVIDER_CONFIGS).join(', ')}`);
  console.log(`- Image fallback chain: Pollinations -> Meshy -> Cloudflare`);
});
