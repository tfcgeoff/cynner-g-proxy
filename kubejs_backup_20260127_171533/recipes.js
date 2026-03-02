// server_scripts/recipes.js
// VoidCore: Skybound Engineering
// Custom Recipe Overrides and Additions

ServerEvents.recipes(event => {

    // ============================================
    // REMOVE VANILLA TOOL RECIPES (Tool Gating)
    // ============================================

    console.log('VoidCore: Removing vanilla tool recipes...')

    // Remove all vanilla iron tool recipes
    event.remove({ output: 'minecraft:iron_pickaxe' })
    event.remove({ output: 'minecraft:iron_axe' })
    event.remove({ output: 'minecraft:iron_sword' })
    event.remove({ output: 'minecraft:iron_shovel' })
    event.remove({ output: 'minecraft:iron_hoe' })
    event.remove({ output: 'minecraft:iron_shears' })

    // Remove all vanilla diamond tool recipes
    event.remove({ output: 'minecraft:diamond_pickaxe' })
    event.remove({ output: 'minecraft:diamond_axe' })
    event.remove({ output: 'minecraft:diamond_sword' })
    event.remove({ output: 'minecraft:diamond_shovel' })
    event.remove({ output: 'minecraft:diamond_hoe' })

    // ============================================
    // ADD GATED TOOL RECIPES (Require Thermal Machine Frames)
    // ============================================

    console.log('VoidCore: Adding gated tool recipes...')

    // Iron Pickaxe - Requires Thermal Machine Frame
    event.shaped('minecraft:iron_pickaxe', [
        'ICI',
        ' S ',
        ' S '
    ], {
        I: 'minecraft:iron_ingot',
        C: 'thermal:machine_frame',
        S: 'minecraft:stick'
    }).id('kubejs:iron_pickaxe')

    // Iron Axe - Requires Machine Core
    event.shaped('minecraft:iron_axe', [
        'II ',
        'IC ',
        ' S '
    ], {
        I: 'minecraft:iron_ingot',
        C: 'thermal:machine_frame',
        S: 'minecraft:stick'
    }).id('kubejs:iron_axe')

    // Iron Sword - Requires Machine Core
    event.shaped('minecraft:iron_sword', [
        ' I ',
        ' I ',
        'CS '
    ], {
        I: 'minecraft:iron_ingot',
        C: 'thermal:machine_frame',
        S: 'minecraft:stick'
    }).id('kubejs:iron_sword')

    // Iron Shovel - Requires Machine Core
    event.shaped('minecraft:iron_shovel', [
        'IC ',
        ' S ',
        ' S '
    ], {
        I: 'minecraft:iron_ingot',
        C: 'thermal:machine_frame',
        S: 'minecraft:stick'
    }).id('kubejs:iron_shovel')

    // Iron Hoe - Requires Machine Core
    event.shaped('minecraft:iron_hoe', [
        'II ',
        'CS ',
        ' S '
    ], {
        I: 'minecraft:iron_ingot',
        C: 'thermal:machine_frame',
        S: 'minecraft:stick'
    }).id('kubejs:iron_hoe')

    // Iron Shears - Requires Machine Core
    event.shaped('minecraft:iron_shears', [
        ' IC',
        'I  ',
        ' IC'
    ], {
        I: 'minecraft:iron_ingot',
        C: 'thermal:machine_frame'
    }).id('kubejs:iron_shears')

    // ============================================
    // DIAMOND TOOLS
    // ============================================
    // Diamond tool recipes are in cross_mod_recipes.js
    // They require RS Upgrade Chip + Iron Tool sacrifice

    // ============================================
    // INSTANT MINE BLOCK RECIPES
    // ============================================

    console.log('VoidCore: Adding instant mine block recipes...')

    // Tier 1: Basic Instant Mine Block
    event.shaped('kubejs:instant_mine_t1', [
        'IRI',
        'RCR',
        'III'
    ], {
        I: 'minecraft:iron_ingot',
        R: 'minecraft:redstone',
        C: 'thermal:machine_frame'
    }).id('kubejs:instant_mine_t1')

    // Hardened Upgrade Component
    event.shaped('kubejs:hardened_upgrade', [
        'SRS',
        'RSR',
        'SRS'
    ], {
        S: '#forge:ingots/steel',  // Steel in-game
        R: 'minecraft:redstone'
    }).id('kubejs:hardened_upgrade')

    // Tier 2: Advanced Instant Mine Block (Upgrade from T1)
    event.shaped('kubejs:instant_mine_t2', [
        'HSI',
        'SCS',
        'ISI'
    ], {
        H: 'kubejs:hardened_upgrade',
        S: 'minecraft:iron_ingot',
        I: 'kubejs:instant_mine_t1',
        C: 'minecraft:gold_ingot'
    }).id('kubejs:instant_mine_t2')

    // Elite Upgrade Component
    event.shaped('kubejs:elite_upgrade', [
        'GDG',
        'DLD',
        'GDG'
    ], {
        G: 'minecraft:gold_ingot',
        D: 'minecraft:diamond',
        L: 'minecraft:ender_pearl'
    }).id('kubejs:elite_upgrade')

    // Tier 3: Elite Instant Mine Block (Upgrade from T2)
    event.shaped('kubejs:instant_mine_t3', [
        'EDE',
        'DTD',
        'EIE'
    ], {
        E: 'kubejs:elite_upgrade',
        D: 'minecraft:diamond',
        T: 'kubejs:instant_mine_t2',
        I: 'minecraft:netherite_ingot'
    }).id('kubejs:instant_mine_t3')

    // Dimensional Upgrade Component (Recipe yields 4)
    event.shaped('4x kubejs:dimensional_upgrade', [
        'NEN',
        'ECE',
        'NEN'
    ], {
        N: 'minecraft:nether_star',
        E: 'minecraft:ender_pearl',
        C: 'ae2:creative_charge'  // Endgame AE2 item
    }).id('kubejs:dimensional_upgrade')

    // Tier 4: Dimensional Instant Mine Block (Upgrade from T3, requires 3 Dimensional Upgrades!)
    event.shaped('kubejs:instant_mine_t4', [
        'DDD',
        'DTD',
        'DCD'
    ], {
        D: 'kubejs:dimensional_upgrade',
        T: 'kubejs:instant_mine_t3',
        C: 'kubejs:creative_core'
    }).id('kubejs:instant_mine_t4')

    // ============================================
    // SOUL NET RECIPE (Skeleton Trading)
    // ============================================

    console.log('VoidCore: Adding soul net recipe...')

    event.shaped('kubejs:soul_net', [
        'SSS',
        'SLS',
        'SSS'
    ], {
        S: 'minecraft:string',
        L: 'minecraft:soul_sand'
    }).id('kubejs:soul_net')

    // ============================================
    // MACHINE UPGRADE RECIPES
    // ============================================

    console.log('VoidCore: Adding machine upgrade recipes...')

    // Speed Upgrade
    event.shaped('kubejs:speed_upgrade', [
        'RGR',
        'GCG',
        'RGR'
    ], {
        R: 'minecraft:redstone',
        G: 'minecraft:gold_ingot',
        C: 'minecraft:clock'
    }).id('kubejs:speed_upgrade')

    // Efficiency Upgrade
    event.shaped('kubejs:efficiency_upgrade', [
        'IEI',
        'ECE',
        'IEI'
    ], {
        I: 'minecraft:iron_ingot',
        E: 'minecraft:emerald',
        C: 'minecraft:comparator'
    }).id('kubejs:efficiency_upgrade')

    // Capacity Upgrade
    event.shaped('kubejs:capacity_upgrade', [
        'SDS',
        'DCD',
        'SDS'
    ], {
        S: '#forge:ingots/steel',  // Steel
        D: 'minecraft:diamond',
        C: 'minecraft:chest'
    }).id('kubejs:capacity_upgrade')

    // Range Upgrade
    event.shaped('kubejs:range_upgrade', [
        'EPE',
        'PCP',
        'EPE'
    ], {
        E: 'minecraft:ender_pearl',
        P: 'minecraft:purple_dye',
        C: 'minecraft:compass'
    }).id('kubejs:range_upgrade')

    // Sound Upgrade (uses Extreme Sound Muffler)
    event.shaped('kubejs:sound_upgrade', [
        'WWW',
        'WCW',
        'WWW'
    ], {
        W: 'minecraft:white_wool',
        C: 'extremesoundmuffler:sound_muffler'
    }).id('kubejs:sound_upgrade')

    // ============================================
    // EMERALD CONDENSER (Functional Light Block)
    // ============================================

    event.shaped('kubejs:emerald_condenser', [
        'EIE',
        'ILI',
        'ECE'
    ], {
        E: 'minecraft:emerald',
        I: 'minecraft:iron_ingot',
        L: 'minecraft:lantern',
        C: 'minecraft:clock'
    }).id('kubejs:emerald_condenser')

    // ============================================
    // LAVA INFUSION PUMP (Replaces Create pump)
    // ============================================

    event.shaped('kubejs:lava_infusion_pump', [
        'PHP',
        'HFR',
        'BBB'
    ], {
        P: 'immersiveengineering:fluid_pipe',
        H: 'minecraft:hopper',
        F: 'minecraft:furnace',
        R: 'minecraft:redstone',
        B: 'minecraft:iron_bars'
    }).id('kubejs:lava_infusion_pump')

    // ============================================
    // REMOVE BROKEN MEKANISM RECIPES
    // ============================================

    console.log('VoidCore: Removing broken Mekanism recipes...')

    // Remove recipes with empty tags that cause errors
    event.remove({ id: 'mekanism:injecting/terracotta_to_clay' })
    event.remove({ id: 'mekanism:rotary/sulfuric_acid' })
    event.remove({ id: 'mekanism:processing/iron/slurry/clean' })

    console.log('VoidCore: All custom recipes registered successfully!')
})
