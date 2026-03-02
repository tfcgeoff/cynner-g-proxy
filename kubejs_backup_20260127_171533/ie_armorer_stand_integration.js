// server_scripts/ie_armorer_stand_integration.js
// VoidCore: Skybound Engineering
// IE Armorer's Stand - Alternative to Anvil for Tool Upgrades

ServerEvents.recipes(event => {

    console.log('VoidCore: Integrating IE Armorer\'s Stand...')

    // ============================================
    // ARMORER'S STAND UPGRADE RECIPES
    // ============================================
    // Alternative to anvil - more "industrial" feel
    // Can also apply with manual anvil, but Armorer's Stand uses power

    // ============================================
    // PICKAXE SPEED UPGRADES (ARMORER'S STAND)
    // ============================================

    // Basic Motor on Iron Pickaxe
    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: 'minecraft:iron_pickaxe',
        result: 'minecraft:iron_pickaxe',
        upgrade: 'kubejs:mining_speed_basic',
        consume: false // Upgrade is not consumed, applies NBT
    }).id('kubejs:armorer/pickaxe_basic_motor')

    // Advanced Motor upgrade
    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: {
            item: 'minecraft:iron_pickaxe',
            nbt: '{Upgrade:"kubejs:mining_speed_basic"}'
        },
        result: 'minecraft:iron_pickaxe',
        upgrade: 'kubejs:mining_speed_advanced',
        consume: false
    }).id('kubejs:armorer/pickaxe_advanced_motor')

    // Elite Motor upgrade
    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: {
            item: 'minecraft:iron_pickaxe',
            nbt: '{Upgrade:"kubejs:mining_speed_advanced"}'
        },
        result: 'minecraft:iron_pickaxe',
        upgrade: 'kubejs:mining_speed_elite',
        consume: false
    }).id('kubejs:armorer/pickaxe_elite_motor')

    // ============================================
    // PICKAXE FORTUNE UPGRADES (ARMORER'S STAND)
    // ============================================

    // Basic Scanner
    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: 'minecraft:iron_pickaxe',
        result: 'minecraft:iron_pickaxe',
        upgrade: 'kubejs:ore_scanner_basic',
        consume: false
    }).id('kubejs:armorer/pickaxe_basic_scanner')

    // Advanced Scanner
    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: {
            item: 'minecraft:iron_pickaxe',
            nbt: '{Upgrade:"kubejs:ore_scanner_basic"}'
        },
        result: 'minecraft:iron_pickaxe',
        upgrade: 'kubejs:ore_scanner_advanced',
        consume: false
    }).id('kubejs:armorer/pickaxe_advanced_scanner')

    // Elite Scanner
    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: {
            item: 'minecraft:iron_pickaxe',
            nbt: '{Upgrade:"kubejs:ore_scanner_advanced"}'
        },
        result: 'minecraft:iron_pickaxe',
        upgrade: 'kubejs:ore_scanner_elite',
        consume: false
    }).id('kubejs:armorer/pickaxe_elite_scanner')

    // ============================================
    // SILK TOUCH UPGRADE (ARMORER'S STAND)
    // ============================================

    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: 'minecraft:iron_pickaxe',
        result: 'minecraft:iron_pickaxe',
        upgrade: 'kubejs:integrity_field',
        consume: false
    }).id('kubejs:armorer/pickaxe_silk_touch')

    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: 'minecraft:diamond_pickaxe',
        result: 'minecraft:diamond_pickaxe',
        upgrade: 'kubejs:integrity_field',
        consume: false
    }).id('kubejs:armorer/diamond_pickaxe_silk_touch')

    // ============================================
    // MENDING UPGRADE (ARMORER'S STAND)
    // ============================================

    // Self-Repair Nanobots - Tools
    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: 'minecraft:iron_pickaxe',
        result: 'minecraft:iron_pickaxe',
        upgrade: 'kubejs:self_repair_nano',
        consume: false
    }).id('kubejs:armorer/iron_pickaxe_mending')

    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: 'minecraft:diamond_pickaxe',
        result: 'minecraft:diamond_pickaxe',
        upgrade: 'kubejs:self_repair_nano',
        consume: false
    }).id('kubejs:armorer/diamond_pickaxe_mending')

    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: 'minecraft:netherite_pickaxe',
        result: 'minecraft:netherite_pickaxe',
        upgrade: 'kubejs:self_repair_nano',
        consume: false
    }).id('kubejs:armorer/netherite_pickaxe_mending')

    // ============================================
    // SWORD UPGRADES (ARMORER'S STAND)
    // ============================================

    // Vibrant Edge (Sharpness I)
    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: 'minecraft:iron_sword',
        result: 'minecraft:iron_sword',
        upgrade: 'kubejs:vibrant_edge',
        consume: false
    }).id('kubejs:armorer/iron_sword_sharpness_1')

    // Pulsating Edge (Sharpness II)
    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: {
            item: 'minecraft:iron_sword',
            nbt: '{Upgrade:"kubejs:vibrant_edge"}'
        },
        result: 'minecraft:iron_sword',
        upgrade: 'kubejs:pulsating_edge',
        consume: false
    }).id('kubejs:armorer/iron_sword_sharpness_2')

    // Energetic Edge (Sharpness III)
    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: {
            item: 'minecraft:iron_sword',
            nbt: '{Upgrade:"kubejs:pulsating_edge"}'
        },
        result: 'minecraft:iron_sword',
        upgrade: 'kubejs:energetic_edge',
        consume: false
    }).id('kubejs:armorer/iron_sword_sharpness_3')

    // Vacuum Collector (Looting)
    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: 'minecraft:iron_sword',
        result: 'minecraft:iron_sword',
        upgrade: 'kubejs:vacuum_collector',
        consume: false
    }).id('kubejs:armorer/iron_sword_looting')

    // ============================================
    // ARMOR UPGRADES (ARMORER'S STAND)
    // ============================================

    // Ballistic Weave (Protection)
    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: 'minecraft:iron_chestplate',
        result: 'minecraft:iron_chestplate',
        upgrade: 'kubejs:ballistic_weave',
        consume: false
    }).id('kubejs:armorer/iron_chest_protection')

    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: 'minecraft:iron_leggings',
        result: 'minecraft:iron_leggings',
        upgrade: 'kubejs:ballistic_weave',
        consume: false
    }).id('kubejs:armorer/iron_legs_protection')

    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: 'minecraft:diamond_chestplate',
        result: 'minecraft:diamond_chestplate',
        upgrade: 'kubejs:ballistic_weave',
        consume: false
    }).id('kubejs:armorer/diamond_chest_protection')

    // Energy Shield
    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: {
            item: 'minecraft:iron_chestplate',
            nbt: '{Upgrade:"kubejs:ballistic_weave"}'
        },
        result: 'minecraft:iron_chestplate',
        upgrade: 'kubejs:energy_shield',
        consume: false
    }).id('kubejs:armorer/iron_chest_shield')

    // Thermal Dissipator (Fire Protection)
    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: 'minecraft:iron_chestplate',
        result: 'minecraft:iron_chestplate',
        upgrade: 'kubejs:thermal_dissipator',
        consume: false
    }).id('kubejs:armorer/iron_chest_fire_protection')

    event.custom({
        type: 'immersiveengineering:armor_upgrade',
        input: 'minecraft:diamond_chestplate',
        result: 'minecraft:diamond_chestplate',
        upgrade: 'kubejs:thermal_dissipator',
        consume: false
    }).id('kubejs:armorer/diamond_chest_fire_protection')

    console.log('VoidCore: Armorer\'s Stand upgrade system configured!')

})
