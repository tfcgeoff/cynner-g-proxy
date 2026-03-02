// server_scripts/botanypots_integration.js
// VoidCore: Skybound Engineering
// BotanyPots Integration - Automated Crop Farming Gated

ServerEvents.recipes(event => {

    console.log('VoidCore: Integrating BotanyPots...')

    // ============================================
    // BOTANY POTS - PROGRESSIVE GATING
    // ============================================
    // Automated farming - essential for skyblock
    // Gated behind appropriate progression tiers

    // ============================================
    // TIER 1: BOTANY POT - BASIC
    // ============================================

    event.remove({ output: 'botanypots:botany_pot' })
    event.shaped('botanypots:botany_pot', [
        'C C',
        'IPI',
        'ICI'
    ], {
        C: 'minecraft:clay_ball',
        I: 'minecraft:iron_ingot',
        P: 'minecraft:flower_pot' // Vanilla item
    }).id('kubejs:botany/basic_pot_gated')

    // ============================================
    // TIER 2: HOPPING BOTANY POT - AUTOMATED
    // ============================================

    event.remove({ output: 'botanypots:hopping_botany_pot' })
    event.shaped('botanypots:hopping_botany_pot', [
        'H',
        'B',
        'I'
    ], {
        H: 'minecraft:hopper', // Requires hopper!
        B: 'botanypots:botany_pot',
        I: 'immersiveengineering:ingot_steel' // Requires IE steel!
    }).id('kubejs:botany/hopping_pot_gated')

    // ============================================
    // TIER 3: ELITE BOTANY POT - ENDGAME
    // ============================================

    event.remove({ output: 'botanypots:elite_botany_pot' })
    event.shaped('botanypots:elite_botany_pot', [
        'E',
        'B',
        'C'
    ], {
        E: 'enderio:octadic_capacitor', // Endgame capacitor!
        B: 'botanypots:hopping_botany_pot',
        C: 'kubejs:creative_core' // Creative tier!
    }).id('kubejs:botany/elite_pot_endgame')

    // ============================================
    // SOIL PROGRESSION
    // ============================================

    // Basic soils (early game)
    // - Dirt (vanilla)
    // - Grass (vanilla)
    // - Farmland (vanilla)

    // Advanced soils (gated)
    event.remove({ output: 'botanypots:copper_soil' })
    event.shaped('botanypots:copper_soil', [
        'SSS',
        'SBS',
        'SSS'
    ], {
        S: 'kubejs:sag_mill_dust_copper', // Requires Sag Mill!
        B: 'botanypots:botany_pot'
    }).id('kubejs:botany/copper_soil_gated')

    event.remove({ output: 'botanypots:iron_soil' })
    event.shaped('botanypots:iron_soil', [
        'SSS',
        'SBS',
        'SSS'
    ], {
        S: 'kubejs:crusher_dust_iron', // Requires Crusher!
        B: 'botanypots:botany_pot'
    }).id('kubejs:botany/iron_soil_gated')

    event.remove({ output: 'botanypots:gold_soil' })
    event.shaped('botanypots:gold_soil', [
        'SSS',
        'SBS',
        'SSS'
    ], {
        S: 'kubejs:crusher_dust_gold', // Requires Crusher!
        B: 'botanypots:hopping_botany_pot'
    }).id('kubejs:botany/gold_soil_gated')

    // Endgame soil
    event.remove({ output: 'botanypots:ender_soil' })
    event.shaped('botanypots:ender_soil', [
        'SSS',
        'SBS',
        'SSS'
    ], {
        S: 'enderio:vibrant_alloy', // Vibrant alloy!
        B: 'botanypots:elite_botany_pot'
    }).id('kubejs:botany/ender_soil_endgame')

    // ============================================
    // CROSS-MOD COMPATIBILITY
    // ============================================
    // Allow BotanyPots to work with crops from other mods

    // Farmer's Delight crops
    // - Should work automatically via tags

    // MysticalAgriculture crops
    // - Should work automatically via tags

    console.log('VoidCore: BotanyPots integrated!')
    console.log('VoidCore: Progressive pot tiers gated behind tech!')
    console.log('VoidCore: Soil types gated behind ore processing!')

})
