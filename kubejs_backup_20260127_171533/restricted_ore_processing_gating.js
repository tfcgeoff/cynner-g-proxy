// server_scripts/restricted_ore_processing_gating.js
// VoidCore: Skybound Engineering
// Gate the ore processing machines with proper requirements

ServerEvents.recipes(event => {

    console.log('VoidCore: Gating ore processing machines...')

    // ============================================
    // GATE SAG MILL - TIER 1
    // ============================================

    // Remove default Sag Mill recipe
    event.remove({ output: 'enderio:sag_mill' })

    // Gated Sag Mill recipe
    event.shaped('enderio:sag_mill', [
        'GFG',
        'ICI',
        'GFG'
    ], {
        G: 'minecraft:gravel',
        F: 'minecraft:furnace',
        I: 'minecraft:iron_ingot',
        C: 'kubejs:starter_capacitor' // Requires starter capacitor!
    }).id('kubejs:gate/sag_mill_recipe')

    // ============================================
    // GATE IE CRUSHER - TIER 2
    // ============================================

    // Remove default Crusher recipe (already removed in restricted_ore_processing.js)
    // Add gated Crusher recipe
    event.shaped('immersiveengineering:crusher', [
        'S S',
        'PCP',
        'S S'
    ], {
        S: 'immersiveengineering:plate_steel',
        P: 'immersiveengineering:piston_crusher',
        C: 'enderio:item_conduit', // Requires Ender IO conduit!
        space: 'kubejs:rs_upgrade_chip' // Requires RS chip!
    }).id('kubejs:gate/crusher_recipe')

    // ============================================
    // GATE MEKANISM ENRICHMENT CHAMBER - TIER 3
    // ============================================

    // Remove default Enrichment Chamber recipe (already removed in restricted_ore_processing.js)
    // Add gated Enrichment Chamber recipe
    event.shaped('mekanism:enrichment_chamber', [
        'ECE',
        'ODO',
        'ECE'
    ], {
        E: 'enderio:octadic_capacitor', // Requires endgame capacitor!
        C: 'mekanism:basic_circuit',
        O: 'mekanism:enriched_alloy',
        D: 'thermal:signalum_ingot' // Thermal mid-game alloy
    }).id('kubejs:gate/enrichment_chamber_recipe')

    console.log('VoidCore: Ore processing machines gated!')
    console.log('VoidCore: Players must progress through all three mods!')
})
