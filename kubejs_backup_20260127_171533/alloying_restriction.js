// server_scripts/alloying_restriction.js
// VoidCore: Skybound Engineering
// ALL alloying redirected to Tinkers Construct Smeltery

ServerEvents.recipes(event => {

    console.log('VoidCore: Redirecting all alloying to Tinkers Smeltery...')

    // ============================================
    // REMOVE ALLOYING MACHINES (not the alloys themselves)
    // ============================================

    // Thermal Series Smelter - Remove ONLY alloying recipes
    // Keep it functional for other processing (ores, etc)
    const thermalAlloys = [
        'thermal:smelter/alloy_bronze',
        'thermal:smelter/alloy_electrum',
        'thermal:smelter/alloy_invar',
        'thermal:smelter/alloy_constantan',
        'thermal:smelter/alloy_signalum',
        'thermal:smelter/alloy_lumium',
        'thermal:smelter/alloy_enderium'
    ]

    thermalAlloys.forEach(alloy => {
        event.remove({ id: alloy })
    })

    // Mekanism - Remove alloying recipes
    event.remove({ type: 'mekanism:combining' })
    event.remove({ type: 'mekanism:metallurgic_infusing' })

    // Immersive Engineering - Remove alloying recipes
    event.remove({ type: 'immersiveengineering:arcfurnace' }) // Remove IE alloying
    event.remove({ type: 'immersiveengineering:metal_press' }) // Remove press alloying

    // Ender IO - Remove all EnderIO alloying
    event.remove({ type: 'enderio:alloy_smelter' })

    // Create - Remove brass mixing (Create mod not installed, commented out)
    // event.remove({ type: 'create:mixing', output: 'create:brass_ingot' })

    // ============================================
    // ADD ALL ALLOY RECIPES TO TINKERS SMELTERY
    // ============================================

    // Common tag format for Tinkers recipes
    // Uses the 'tconstruct:smeltery' recipe type

    // BRONZE (Copper + Tin) - Universal
    // Used by: Thermal, Mekanism, IE, EnderIO
    event.custom({
        type: 'tconstruct:melting',
        ingredient: { tag: 'forge:ingots/copper' },
        result: { fluid: 'tconstruct:molten_copper', amount: 144 },
        temperature: 500,
        time: 50
    }).id('kubejs:melting/copper')

    event.custom({
        type: 'tconstruct:melting',
        ingredient: { tag: 'forge:ingots/tin' },
        result: { fluid: 'tconstruct:molten_tin', amount: 144 },
        temperature: 400,
        time: 40
    }).id('kubejs:melting/tin')

    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'tconstruct:molten_copper', amount: 288 }, // 2 copper
            { fluid: 'tconstruct:molten_tin', amount: 144 }     // 1 tin
        ],
        result: { fluid: 'tconstruct:molten_bronze', amount: 432 }, // 3 bronze
        temperature: 600,
        time: 100
    }).id('kubejs:alloy/bronze')

    // Casting table for bronze ingots
    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'tconstruct:molten_bronze', amount: 144 },
        result: 'thermal:bronze_ingot',
        cooling_time: 50
    }).id('kubejs:casting/bronze_ingot')

    // ELECTRUM (Gold + Silver) - Thermal, EnderIO
    event.custom({
        type: 'tconstruct:melting',
        ingredient: { tag: 'forge:ingots/silver' },
        result: { fluid: 'tconstruct:molten_silver', amount: 144 },
        temperature: 700,
        time: 60
    }).id('kubejs:melting/silver')

    event.custom({
        type: 'tconstruct:melting',
        ingredient: { tag: 'forge:ingots/gold' },
        result: { fluid: 'tconstruct:molten_gold', amount: 144 },
        temperature: 700,
        time: 60
    }).id('kubejs:melting/gold')

    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'tconstruct:molten_gold', amount: 144 },
            { fluid: 'tconstruct:molten_silver', amount: 144 }
        ],
        result: { fluid: 'kubejs:molten_electrum', amount: 288 },
        temperature: 800,
        time: 120
    }).id('kubejs:alloy/electrum')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_electrum', amount: 144 },
        result: 'thermal:electrum_ingot',
        cooling_time: 60
    }).id('kubejs:casting/electrum_ingot')

    // INVAR (Iron + Nickel) - Thermal
    event.custom({
        type: 'tconstruct:melting',
        ingredient: { tag: 'forge:ingots/nickel' },
        result: { fluid: 'kubejs:molten_nickel', amount: 144 },
        temperature: 900,
        time: 70
    }).id('kubejs:melting/nickel')

    event.custom({
        type: 'tconstruct:melting',
        ingredient: { tag: 'forge:ingots/iron' },
        result: { fluid: 'tconstruct:molten_iron', amount: 144 },
        temperature: 800,
        time: 60
    }).id('kubejs:melting/iron')

    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'tconstruct:molten_iron', amount: 288 }, // 2 iron
            { fluid: 'kubejs:molten_nickel', amount: 144 }    // 1 nickel
        ],
        result: { fluid: 'kubejs:molten_invar', amount: 432 },
        temperature: 900,
        time: 130
    }).id('kubejs:alloy/invar')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_invar', amount: 144 },
        result: 'thermal:invar_ingot',
        cooling_time: 70
    }).id('kubejs:casting/invar_ingot')

    // CONSTANTAN (Copper + Nickel) - Thermal
    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'tconstruct:molten_copper', amount: 144 },
            { fluid: 'kubejs:molten_nickel', amount: 144 }
        ],
        result: { fluid: 'kubejs:molten_constantan', amount: 288 },
        temperature: 850,
        time: 120
    }).id('kubejs:alloy/constantan')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_constantan', amount: 144 },
        result: 'thermal:constantan_ingot',
        cooling_time: 65
    }).id('kubejs:casting/constantan_ingot')

    // SIGNALUM (Copper + Silver + Redstone) - Thermal
    event.custom({
        type: 'tconstruct:melting',
        ingredient: { tag: 'forge:dusts/redstone' },
        result: { fluid: 'tconstruct:molten_redstone', amount: 288 },
        temperature: 400,
        time: 30
    }).id('kubejs:melting/redstone')

    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'tconstruct:molten_copper', amount: 144 },
            { fluid: 'tconstruct:molten_silver', amount: 144 },
            { fluid: 'tconstruct:molten_redstone', amount: 288 } // 2 redstone
        ],
        result: { fluid: 'kubejs:molten_signalum', amount: 576 },
        temperature: 1000,
        time: 150
    }).id('kubejs:alloy/signalum')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_signalum', amount: 144 },
        result: 'thermal:signalum_ingot',
        cooling_time: 80
    }).id('kubejs:casting/signalum_ingot')

    // LUMIUM (Silver + Titanium + Glowstone) - Thermal
    event.custom({
        type: 'tconstruct:melting',
        ingredient: { tag: 'forge:ingots/titanium' },
        result: { fluid: 'kubejs:molten_titanium', amount: 144 },
        temperature: 1100,
        time: 80
    }).id('kubejs:melting/titanium')

    event.custom({
        type: 'tconstruct:melting',
        ingredient: { tag: 'forge:glowstone_dusts' },
        result: { fluid: 'kubejs:molten_glowstone', amount: 250 },
        temperature: 600,
        time: 40
    }).id('kubejs:melting/glowstone')

    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'tconstruct:molten_silver', amount: 144 },
            { fluid: 'kubejs:molten_titanium', amount: 144 },
            { fluid: 'kubejs:molten_glowstone', amount: 250 }
        ],
        result: { fluid: 'kubejs:molten_lumium', amount: 538 },
        temperature: 1100,
        time: 160
    }).id('kubejs:alloy/lumium')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_lumium', amount: 144 },
        result: 'thermal:lumium_ingot',
        cooling_time: 70
    }).id('kubejs:casting/lumium_ingot')

    // ENDERIUM (Silver + Lead + Ender Pearl + Glowstone) - Thermal
    event.custom({
        type: 'tconstruct:melting',
        ingredient: { tag: 'forge:ingots/lead' },
        result: { fluid: 'kubejs:molten_lead', amount: 144 },
        temperature: 700,
        time: 60
    }).id('kubejs:melting/lead')

    event.custom({
        type: 'tconstruct:melting',
        ingredient: { item: 'minecraft:ender_pearl' },
        result: { fluid: 'kubejs:molten_ender', amount: 250 },
        temperature: 900,
        time: 80
    }).id('kubejs:melting/ender_pearl')

    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'tconstruct:molten_silver', amount: 144 },
            { fluid: 'kubejs:molten_lead', amount: 288 },      // 2 lead
            { fluid: 'kubejs:molten_ender', amount: 250 },
            { fluid: 'kubejs:molten_glowstone', amount: 250 }
        ],
        result: { fluid: 'kubejs:molten_enderium', amount: 932 },
        temperature: 1300,
        time: 200
    }).id('kubejs:alloy/enderium')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_enderium', amount: 144 },
        result: 'thermal:enderium_ingot',
        cooling_time: 100
    }).id('kubejs:casting/enderium_ingot')

    // BRASS (Copper + Zinc) - Tinkers, Create
    event.custom({
        type: 'tconstruct:melting',
        ingredient: { tag: 'forge:ingots/zinc' },
        result: { fluid: 'kubejs:molten_zinc', amount: 144 },
        temperature: 600,
        time: 50
    }).id('kubejs:melting/zinc')

    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'tconstruct:molten_copper', amount: 288 }, // 2 copper
            { fluid: 'kubejs:molten_zinc', amount: 144 }        // 1 zinc
        ],
        result: { fluid: 'tconstruct:molten_brass', amount: 432 },
        temperature: 650,
        time: 110
    }).id('kubejs:alloy/brass')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'tconstruct:molten_brass', amount: 144 },
        result: 'thermal:brass_ingot',
        cooling_time: 55
    }).id('kubejs:casting/brass_ingot')

    // STEEL (Iron + Coal/Diamond) - IE, Mekanism
    event.custom({
        type: 'tconstruct:melting',
        ingredient: { tag: 'forge:gems/carbon' }, // Coal/Charcoal/Diamond
        result: { fluid: 'kubejs:molten_carbon', amount: 144 },
        temperature: 1000,
        time: 70
    }).id('kubejs:melting/carbon')

    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'tconstruct:molten_iron', amount: 288 },    // 2 iron
            { fluid: 'kubejs:molten_carbon', amount: 144 }       // 1 carbon
        ],
        result: { fluid: 'kubejs:molten_steel', amount: 432 },
        temperature: 1500,
        time: 180
    }).id('kubejs:alloy/steel')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_steel', amount: 144 },
        result: 'immersiveengineering:ingot_steel',
        cooling_time: 90
    }).id('kubejs:casting/steel_ingot')

    // ELECTRICAL STEEL (Iron + Coal/Electricity) - IE
    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'tconstruct:molten_iron', amount: 144 },
            { fluid: 'kubejs:molten_carbon', amount: 144 },
            { fluid: 'tconstruct:molten_redstone', amount: 144 }
        ],
        result: { fluid: 'kubejs:molten_electrical_steel', amount: 432 },
        temperature: 1400,
        time: 170
    }).id('kubejs:alloy/electrical_steel')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_electrical_steel', amount: 144 },
        result: 'immersiveengineering:ingot_electrical',
        cooling_time: 85
    }).id('kubejs:casting/electrical_steel_ingot')

    // ENDER IO ALLOYS
    // Conductive Iron (Iron + Redstone + Power simulation)
    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'tconstruct:molten_iron', amount: 144 },
            { fluid: 'tconstruct:molten_redstone', amount: 288 } // 2 redstone
        ],
        result: { fluid: 'kubejs:molten_conductive_iron', amount: 432 },
        temperature: 950,
        time: 140
    }).id('kubejs:alloy/conductive_iron')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_conductive_iron', amount: 144 },
        result: 'enderio:conductive_alloy',
        cooling_time: 75
    }).id('kubejs:casting/conductive_iron_ingot')

    // Energetic Alloy (Gold + Redstone)
    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'tconstruct:molten_gold', amount: 144 },
            { fluid: 'tconstruct:molten_redstone', amount: 288 }
        ],
        result: { fluid: 'kubejs:molten_energetic', amount: 432 },
        temperature: 1050,
        time: 150
    }).id('kubejs:alloy/energetic')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_energetic', amount: 144 },
        result: 'enderio:energetic_alloy',
        cooling_time: 80
    }).id('kubejs:casting/energetic_ingot')

    // Vibrant Alloy (Energetic + Ender)
    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'kubejs:molten_energetic', amount: 288 },
            { fluid: 'kubejs:molten_ender', amount: 250 }
        ],
        result: { fluid: 'kubejs:molten_vibrant', amount: 538 },
        temperature: 1200,
        time: 180
    }).id('kubejs:alloy/vibrant')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_vibrant', amount: 144 },
        result: 'enderio:vibrant_alloy',
        cooling_time: 90
    }).id('kubejs:casting/vibrant_ingot')

    // Pulsating Iron (Iron + Ender)
    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'tconstruct:molten_iron', amount: 144 },
            { fluid: 'kubejs:molten_ender', amount: 125 }
        ],
        result: { fluid: 'kubejs:molten_pulsating', amount: 269 },
        temperature: 1000,
        time: 130
    }).id('kubejs:alloy/pulsating')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_pulsating', amount: 144 },
        result: 'enderio:pulsating_alloy',
        cooling_time: 70
    }).id('kubejs:casting/pulsating_ingot')

    // Dark Steel (Iron + Carbon + Obsidian)
    event.custom({
        type: 'tconstruct:melting',
        ingredient: { item: 'minecraft:obsidian' },
        result: { fluid: 'kubejs:molten_obsidian', amount: 144 },
        temperature: 1400,
        time: 100
    }).id('kubejs:melting/obsidian')

    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'tconstruct:molten_iron', amount: 288 },
            { fluid: 'kubejs:molten_carbon', amount: 144 },
            { fluid: 'kubejs:molten_obsidian', amount: 144 }
        ],
        result: { fluid: 'kubejs:molten_dark_steel', amount: 576 },
        temperature: 1550,
        time: 200
    }).id('kubejs:alloy/dark_steel')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_dark_steel', amount: 144 },
        result: 'enderio:dark_steel',
        cooling_time: 95
    }).id('kubejs:casting/dark_steel_ingot')

    // Soularium (Soul Sand + Gold)
    event.custom({
        type: 'tconstruct:melting',
        ingredient: { item: 'minecraft:soul_sand' },
        result: { fluid: 'kubejs:molten_soul_sand', amount: 250 },
        temperature: 800,
        time: 60
    }).id('kubejs:melting/soul_sand')

    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'kubejs:molten_soul_sand', amount: 250 },
            { fluid: 'tconstruct:molten_gold', amount: 144 }
        ],
        result: { fluid: 'kubejs:molten_soularium', amount: 394 },
        temperature: 1100,
        time: 160
    }).id('kubejs:alloy/soularium')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_soularium', amount: 144 },
        result: 'enderio:soularium',
        cooling_time: 85
    }).id('kubejs:casting/soularium_ingot')

    // End Steel (Dark Steel + Enderium)
    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'kubejs:molten_dark_steel', amount: 288 },
            { fluid: 'kubejs:molten_ender', amount: 125 }
        ],
        result: { fluid: 'kubejs:molten_end_steel', amount: 413 },
        temperature: 1600,
        time: 220
    }).id('kubejs:alloy/end_steel')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_end_steel', amount: 144 },
        result: 'enderio:end_steel',
        cooling_time: 100
    }).id('kubejs:casting/end_steel_ingot')

    // ============================================
    // MEKANISM SPECIAL ALLOYS
    // ============================================

    // Refined Glowstone (Redstone + Glowstone)
    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'tconstruct:molten_redstone', amount: 288 },
            { fluid: 'kubejs:molten_glowstone', amount: 250 }
        ],
        result: { fluid: 'kubejs:molten_refined_glowstone', amount: 538 },
        temperature: 700,
        time: 120
    }).id('kubejs:alloy/refined_glowstone')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_refined_glowstone', amount: 144 },
        result: 'mekanism:ingot_refined_glowstone',
        cooling_time: 65
    }).id('kubejs:casting/refined_glowstone_ingot')

    // Refined Obsidian (Obsidian + Glowstone + Dust)
    event.custom({
        type: 'tconstruct:alloy',
        inputs: [
            { fluid: 'kubejs:molten_obsidian', amount: 144 },
            { fluid: 'kubejs:molten_glowstone', amount: 125 },
            { fluid: 'tconstruct:molten_redstone', amount: 144 }
        ],
        result: { fluid: 'kubejs:molten_refined_obsidian', amount: 413 },
        temperature: 1500,
        time: 190
    }).id('kubejs:alloy/refined_obsidian')

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'tconstruct:casts/multi_use/ingot' },
        fluid: { fluid: 'kubejs:molten_refined_obsidian', amount: 144 },
        result: 'mekanism:ingot_refined_obsidian',
        cooling_time: 90
    }).id('kubejs:casting/refined_obsidian_ingot')

    console.log('VoidCore: All alloying redirected to Tinkers Smeltery!')
    console.log('VoidCore: Alloying machines from other mods disabled.')
})
