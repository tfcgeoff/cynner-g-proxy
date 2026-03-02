// server_scripts/compact_machines_integration.js
// VoidCore: Skybound Engineering
// Compact Machines Integration - Room-Based Automation (Tech Only)

ServerEvents.recipes(event => {

    console.log('VoidCore: Integrating Compact Machines...')

    // ============================================
    // COMPACT MACHINES - PROGRESSION GATING
    // ============================================
    // Room-in-a-block for resource generation and automation
    // Perfect for skyblock - maximize space efficiency
    // This is TECHNOLOGY - dimensional compression, not magic

    // ============================================
    // TIER 1: PERSONAL SHRINE (3x3x3 internal)
    // ============================================

    event.remove({ output: 'compactmachines:personal_shrine' })
    event.shaped('compactmachines:personal_shrine', [
        'ICI',
        'CMC',
        'IRI'
    ], {
        I: 'minecraft:iron_ingot',
        C: 'minecraft:chest',
        M: 'thermal:machine_frame', // Machine Core!
        R: 'minecraft:redstone'
    }).id('kubejs:compact/personal_shrine_gated')

    // ============================================
    // TIER 2: MINI COMPACT MACHINE (5x5x5 internal)
    // ============================================

    event.remove({ output: 'compactmachines:machine_tier_2' })
    event.shaped('compactmachines:machine_tier_2', [
        'SCS',
        'CMC',
        'SIS'
    ], {
        S: 'immersiveengineering:plate_steel', // Steel plates
        C: 'enderio:basic_capacitor', // Capacitor!
        M: 'compactmachines:personal_shrine', // Upgrade from Tier 1
        I: 'minecraft:iron_block'
    }).id('kubejs:compact/machine_tier2_gated')

    // ============================================
    // TIER 3: COMPACT MACHINE (7x7x7 internal)
    // ============================================

    event.remove({ output: 'compactmachines:machine_tier_3' })
    event.shaped('compactmachines:machine_tier_3', [
        'GCG',
        'EME',
        'GIG'
    ], {
        G: 'thermal:signalum_ingot', // Signalum (endgame alloy)
        C: 'enderio:octadic_capacitor', // Octadic Capacitor!
        E: 'mekanism:enrichment_chamber', // Enrichment Chamber!
        M: 'compactmachines:machine_tier_2', // Upgrade from Tier 2
        I: 'thermal:enderium_ingot'
    }).id('kubejs:compact/machine_tier3_gated')

    // ============================================
    // TIER 4: GIANT COMPACT MACHINE (10x10x10 internal)
    // ============================================

    event.remove({ output: 'compactmachines:machine_tier_4' })
    event.shaped('compactmachines:machine_tier_4', [
        'VIV',
        'ECE',
        'VCV'
    ], {
        V: 'enderio:vibrant_alloy', // Vibrant alloy!
        I: 'thermal:enderium_block',
        C: 'kubejs:creative_core', // Creative Core!
        E: 'compactmachines:machine_tier_3' // Upgrade from Tier 3
    }).id('kubejs:compact/machine_tier4_gated')

    // ============================================
    // TIER 5: ULTRA COMPACT MACHINE (15x15x15 internal)
    // ============================================

    event.remove({ output: 'compactmachines:machine_tier_5' })
    event.shaped('compactmachines:machine_tier_5', [
        'NCN',
        'NCN',
        'NCN'
    ], {
        N: 'minecraft:netherite_block', // Netherite!
        C: 'kubejs:creative_core',
        N: 'kubejs:netherite_core' // Netherite Core!
    }).id('kubejs:compact/machine_tier5_endgame')

    // ============================================
    // COMPACT TUNNEL ( ITEM TRANSPORT )
    // ============================================

    event.remove({ output: 'compactmachines:tunnel' })
    event.shaped('compactmachines:tunnel', [
        'PIP',
        'IMI',
        'PIP'
    ], {
        P: 'immersiveengineering:conveyor_basic', // IE Conveyors!
        I: 'minecraft:iron_ingot',
        M: 'mekanism:basic_machine' // Mekanism machine
    }).id('kubejs:compact/tunnel_gated')

    // ============================================
    // WALL BREAKER (ACCESS)
    // ============================================

    event.remove({ output: 'compactmachines:wall_breaker' })
    event.shaped('compactmachines:wall_breaker', [
        'DPD',
        'PSP',
        'DPD'
    ], {
        D: 'minecraft:diamond_pickaxe',
        P: 'immersiveengineering:plate_steel',
        S: 'minecraft:stone'
    }).id('kubejs:compact/wall_breaker_gated')

    console.log('VoidCore: Compact Machines integrated!')
    console.log('VoidCore: Dimensional compression technology gated!')
    console.log('VoidCore: Tiers gated behind Machine Core progression!')

})
