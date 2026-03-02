// server_scripts/farmers_delight_integration.js
// VoidCore: Skybound Engineering
// Farmer's Delight Integration - Food & Cooking System

ServerEvents.recipes(event => {

    console.log('VoidCore: Integrating Farmer\'s Delight...')

    // ============================================
    // FARMER'S DELIGHT PROGRESSION
    // ============================================
    // Cooking and food system
    // Most recipes stay vanilla (accessible early game)
    // But some advanced items are gated

    // ============================================
    // COOKING POT - EARLY GAME
    // ============================================

    event.remove({ output: 'farmersdelight:cooking_pot' })
    event.shaped('farmersdelight:cooking_pot', [
        'ISI',
        'PCP',
        'I I'
    ], {
        I: 'minecraft:iron_ingot',
        S: 'minecraft:stone', // Any stone
        P: 'minecraft:cauldron' // Vanilla cauldron
    }).id('kubejs:fd/cooking_pot_gated')

    // ============================================
    // SKILLET - EARLY GAME
    // ============================================

    event.remove({ output: 'farmersdelight:skillet' })
    event.shaped('farmersdelight:skillet', [
        ' I ',
        'III',
        ' S '
    ], {
        I: 'minecraft:iron_ingot',
        S: 'minecraft:stick'
    }).id('kubejs:fd/skillet_gated')

    // ============================================
    // CUTTING BOARD - EARLY GAME
    // ============================================

    event.remove({ output: 'farmersdelight:cutting_board' })
    event.shaped('farmersdelight:cutting_board', [
        'AA',
        'AA'
    ], {
        A: 'minecraft:oak_planks' // Any planks
    }).id('kubejs:fd/cutting_board_gated')

    // ============================================
    // BASKET - STORAGE
    // ============================================

    event.remove({ output: 'farmersdelight:basket' })
    event.shaped('farmersdelight:basket', [
        'S S',
        'S S',
        'WWW'
    ], {
        S: 'minecraft:stick',
        W: 'minecraft:oak_slab' // Any slab
    }).id('kubejs:fd/basket_gated')

    // ============================================
    // RICH SOIL - FERTILIZER (GATED)
    // ============================================
    // Requires bone meal + compost progression

    event.remove({ output: 'farmersdelight:rich_soil' })
    event.shapeless('farmersdelight:rich_soil', [
        'minecraft:dirt',
        'minecraft:bone_meal',
        'minecraft:bone_meal',
        'kubejs:sag_mill_dust_iron' // Requires Sag Mill!
    ], 4).id('kubejs:fd/rich_soil_gated')

    // ============================================
    // ORGANIC COMPOST - FERTILIZER
    // ============================================

    event.remove({ output: 'farmersdelight:organic_compost' })
    event.shapeless('farmersdelight:organic_compost', [
        'minecraft:dirt',
        'minecraft:rotten_flesh',
        'minecraft:rotten_flesh',
        'minecraft:bone_meal'
    ], 2).id('kubejs:fd/organic_compost')

    // ============================================
    // TATTOO PARLOR - LATE GAME
    // ============================================

    event.remove({ output: 'farmersdelight:tattoo_parlor' })
    event.shaped('farmersdelight:tattoo_parlor', [
        'GLG',
        'BCB',
        'GLG'
    ], {
        G: 'minecraft:gold_ingot',
        L: 'minecraft:leather',
        B: 'minecraft:book',
        C: 'thermal:machine_frame' // Requires Machine Core!
    }).id('kubejs:fd/tattoo_parlor_gated')

    // ============================================
    // MOTOR - FOR CARTS (GATED)
    // ============================================

    event.remove({ output: 'farmersdelight:motor' })
    event.shaped('farmersdelight:motor', [
        'ICI',
        'ERE',
        'ICI'
    ], {
        I: 'minecraft:iron_ingot',
        C: 'mekanism:basic_circuit', // Requires circuit!
        R: 'minecraft:redstone',
        E: 'enderio:basic_capacitor' // Requires capacitor!
    }).id('kubejs:fd/motor_gated')

    // ============================================
    // FOOD CROSS-INTEGRATION
    // ============================================

    // Rope from Ender IO (if available)
    // Otherwise use vanilla string

    // ============================================
    // CROP SEEDS - EARLY GAME
    // ============================================

    // Most seeds should be craftable from crops
    // This is standard Farmer's Delight behavior
    // No gating needed for basic crops

    // Rice seeds (early game)
    event.shapeless('farmersdelight:rice', [
        'minecraft:wheat_seeds',
        'minecraft:water_bucket'
    ]).id('kubejs:fd/rice_from_seeds')

    // Tomato seeds
    event.shapeless('farmersdelight:tomato_seeds', [
        'farmersdelight:tomato'
    ]).id('kubejs:fd/tomato_seeds')

    console.log('VoidCore: Farmers Delight integrated!')
    console.log('VoidCore: Advanced cooking gated behind tech!')
    console.log('VoidCore: Rich soil requires Sag Mill!')

})
