# MCP Proxy Server

**Moved from:** `/home/geoff/Documents/Games/Ego Somnium/Proxy-MCP.js`
**Date:** 2026-01-27

---

## Overview

This is a standalone MCP (Model Context Protocol) proxy server that:
1. Receives AI queries from MCP clients (like Claude CLI)
2. Routes requests to appropriate AI providers
3. Implements restricted AI blocking
4. Provides MCP discovery endpoint

---

## Files

- **Proxy-MCP.js** - Main proxy server implementation
- **package.json** - Node.js dependencies and scripts
- **README.md** - This file

---

## Configuration

**Environment Variables:**
- `PORT` - Server port (default: 3000)
- `MCP_PROXY_API_KEY` - API key for proxy authentication
- `MCP_PROXY_URL` - Proxy server URL (default: `http://localhost:3000/proxy`)
- `MCP_RESTRICTED_AI` - Restricted AI provider (default: `restricted-provider`)

**Default Port:** 3000

---

## Running the Server

```bash
cd /home/geoff/Documents/Games/Utilities/ProxyServer
npm install
npm start
```

The server will listen on port 3000 and provide:
- `/mcp` - MCP discovery endpoint
- `/mcp/invoke` - MCP invoke endpoint (called by Claude)
- `/` - Health check

---

## Endpoints

### MCP Discovery: `GET /mcp`

Returns MCP server information and available tools.

### MCP Invoke: `POST /mcp/invoke`

**Parameters:**
- `tool`: Must be `"query_ai"`
- `parameters.provider`: AI provider (e.g., "openai", "gemini")
- `parameters.model`: Specific model (e.g., "gpt-4")
- `parameters.prompt`: The prompt to send

**Response:**
```json
{
  "result": { "response": "AI response here" }
}
```

---

## Restricted AI

The proxy blocks access to `restricted-provider` and any model containing `restricted-provider` in the name. This is configurable via the `RESTRICTED_AI` constant in Proxy-MCP.js.

---

## AI Provider URL Fixes (2026-01-27)

**Fixed URLs in:** `/home/geoff/Documents/Games/Ego Somnium/EgoSomnium-server/src/services/aiProviderService.ts`

### GroqCloud (FIXED)
**Old (incorrect):**
- BaseURL: `https://api.groq.com/openai/v1`
- Endpoint: `/chat/completions`

**New (correct):**
- BaseURL: `https://api.groq.com`
- Endpoint: `/openai/v1/chat/completions`

**Source:** [GroqCloud Console](https://console.groq.com/docs)

### Cerebras (FIXED)
**Old (incorrect):**
- BaseURL: `https://api.cerebras.ai/v1`
- Endpoint: `/chat/completions`

**New (correct):**
- BaseURL: `https://api.cerebras.ai`
- Endpoint: `/v1/chat/completions`

**Source:** [Cerebras Developer Portal](https://docs.cerebras.ai/)

---

## Original Location

**Previously at:** `/home/geoff/Documents/Games/Ego Somnium/Proxy-MCP.js`

**Status:** Copied to `/home/geoff/Documents/Games/Utilities/ProxyServer/Proxy-MCP.js`

The original file remains in the Ego Somnium directory for now but should eventually be removed to avoid confusion.

---

**Last Updated:** 2026-01-27

