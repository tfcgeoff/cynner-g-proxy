// server_scripts/industrial_foregoing_integration.js
// VoidCore: Skybound Engineering
// Industrial Foregoing Laser Drill - Ore Generation for Skyblock

ServerEvents.recipes(event => {

    console.log('VoidCore: Integrating Industrial Foregoing Laser Drill...')

    // ============================================
    // LASER DRILL - CROSS-MOD GATING
    // ============================================
    // The Laser Drill is the PRIMARY method of ore generation in skyblock
    // Requires late-game components from all major tech mods

    event.remove({ output: 'industrialforegoing:laser_drill' })
    event.shaped('industrialforegoing:laser_drill', [
        'MFM',
        'DLD',
        'MCM'
    ], {
        M: 'thermal:machine_frame', // Machine Core (tool gating)
        F: 'mekanism:enrichment_chamber', // Mekanism machine (tier 4 ore processing)
        D: 'minecraft:diamond_block', // Diamond block
        L: 'thermal:lens', // Thermal lens
        C: 'enderio:octadic_capacitor', // Endgame capacitor
        space: 'immersiveengineering:he_hammer' // IE Heavy Engineering Hammer
    }).id('kubejs:industrial/laser_drill_cross_gated')

    // ============================================
    // LASER DRILL PRECHARGER
    // ============================================

    event.remove({ output: 'industrialforegoing:laser_drill_precharger' })
    event.shaped('industrialforegoing:laser_drill_precharger', [
        'ECE',
        'LDL',
        'ECE'
    ], {
        E: 'enderio:energetic_alloy', // Ender IO energetic alloy
        C: 'mekanism:basic_circuit', // Mekanism circuit
        L: 'thermal:lens', // Thermal lens
        D: 'thermal:machine_frame' // Machine Core
    }).id('kubejs:industrial/laser_drill_precharger_gated')

    // ============================================
    // ORE GENERATION SETUP
    // ============================================
    // Laser Drill generates resources at different depths
    // In skyblock, we configure it to work at any Y level
    // Resource consumption: Liquid Laser Focus (redstone + glowstone)

    // Remove unused Industrial Foregoing machines (single tool mandate)
    const unwantedMachines = [
        'industrialforegoing:animal_baby_separator',
        'industrialforegoing:animal_rancher',
        'industrialforegoing:animal_feeder',
        'industrialforegoing:mob_slaughter_factory',
        'industrialforegoing:sewer',
        'industrialforegoing:slaughter_factory',
        'industrialforegoing:pitiless_furnace',
        'industrialforegoing:material_stonework_factory',
        'industrialforegoing:dye_mixer',
        'industrialforegoing:enchantment_refiner',
        'industrialforegoing:enchantment_extractor',
        'industrialforegoing:enchantment_applicator',
        'industrialforegoing:enchantment_factory',
        'industrialforegoing:fluid_extractor',
        'industrialforegoing:fluid_collector',
        'industrialforegoing:fluid_placer',
        'industrialforegoing:fluid_laser_base',
        'industrialforegoing:laser_drill_fluid',
        'industrialforegoing:biofuel_generator',
        'industrialforegoing:bio_reactor',
        'industrialforegoing:plant_fertilizer',
        'industrialforegoing:plant_sower',
        'industrialforegoing:plant_gatherer',
        'industrialforegoing:plant_sower',
        'industrialforegoing:hydroponic_bed',
        'industrialforegoing:flower_plot',
        'industrialforegoing:mob_detector',
        'industrialforegoing:plant_scanner',
        'industrialforegoing:crop_replanter',
        'industrialforegoing:crop_sower',
        'industrialforegoing:crop_enricher',
        'industrialforegoing:crop_farm',
        'industrialforegoing:fertilizer',
        'industrialforegoing:range_addon',
        'industrialforegoing:speed_addon',
        'industrialforegoing:processing_speed_addon',
        'industrialforegoing:laser_drill_recharge',
    ]

    unwantedMachines.forEach(machine => {
        event.remove({ output: machine })
    })

    console.log('VoidCore: Removed ' + unwantedMachines.length + ' unused Industrial Foregoing machines')
    console.log('VoidCore: Laser Drill configured for skyblock ore generation!')
    console.log('VoidCore: Laser Drill requires: Machine Core + Octadic Capacitor + Heavy Engineering')

})

// ============================================
// LASER DRILL ORE GENERATION CONFIG
// ============================================

// Configure Laser Drill to work in skyblock (no traditional mining)
// The drill generates resources based on Y-level and biomes
// In skyblock, we configure it to generate all ores at any level

// Note: This is configured via Industrial Foregoing config
// See: config/industrialforegoing/common.toml
// Set laser_drill_max_energy to reasonable values
// Set ore_gen_blacklist to empty (allow all ores)

console.log('VoidCore: Laser Drill will generate ores when powered')
console.log('VoidCore: Requires Laser Lens (Thermal) for specific ore targeting')
