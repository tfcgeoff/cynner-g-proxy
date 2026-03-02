// server_scripts/tech_tool_system.js
// VoidCore: Skybound Engineering
// Tech-Based Tool System - Replaces Vanilla + Enchantments

ServerEvents.recipes(event => {

    console.log('VoidCore: Implementing tech tool system...')

    // ============================================
    // REMOVE VANILLA ENCHANTING
    // ============================================
    // Enchantment table is magical - use tech upgrades instead

    event.remove({ output: 'minecraft:enchanting_table' })
    event.remove({ type: 'minecraft:enchanting' })

    // ============================================
    // IRON TOOLS - GATED WITH THERMAL COMPONENTS
    // ============================================
    // Iron tools require Thermal machine cores and pipes (no sticks!)

    // Iron Pickaxe (Machine Core + Pipes instead of sticks)
    event.remove({ output: 'minecraft:iron_pickaxe' })
    event.shaped('minecraft:iron_pickaxe', [
        'III',
        'F F',
        ' P '
    ], {
        I: 'minecraft:iron_ingot',
        F: 'thermal:machine_frame', // Machine Core!
        P: 'thermal:flux_pipe' // Flux Pipe instead of stick!
    }).id('kubejs:tools/iron_pickaxe_tech')

    // Iron Axe
    event.remove({ output: 'minecraft:iron_axe' })
    event.shaped('minecraft:iron_axe', [
        'II',
        'IF',
        ' P'
    ], {
        I: 'minecraft:iron_ingot',
        F: 'thermal:machine_frame',
        P: 'thermal:flux_pipe'
    }).id('kubejs:tools/iron_axe_tech')

    // Iron Shovel
    event.remove({ output: 'minecraft:iron_shovel' })
    event.shaped('minecraft:iron_shovel', [
        'I',
        'F',
        'P'
    ], {
        I: 'minecraft:iron_ingot',
        F: 'thermal:machine_frame',
        P: 'thermal:flux_pipe'
    }).id('kubejs:tools/iron_shovel_tech')

    // Iron Hoe
    event.remove({ output: 'minecraft:iron_hoe' })
    event.shaped('minecraft:iron_hoe', [
        'II',
        'FP',
        ' P'
    ], {
        I: 'minecraft:iron_ingot',
        F: 'thermal:machine_frame',
        P: 'thermal:flux_pipe'
    }).id('kubejs:tools/iron_hoe_tech')

    // Iron Sword
    event.remove({ output: 'minecraft:iron_sword' })
    event.shaped('minecraft:iron_sword', [
        'I',
        'I',
        'P'
    ], {
        I: 'minecraft:iron_ingot',
        P: 'thermal:flux_duct' // Flux Duct for sword (stiffer)
    }).id('kubejs:tools/iron_sword_tech')

    // ============================================
    // UPGRADE COMPONENT CRAFTING
    // ============================================

    // Mining Speed Upgrades
    event.shaped('kubejs:mining_speed_basic', [
        'RIR',
        'ICI',
        'RIR'
    ], {
        R: 'minecraft:redstone',
        I: 'minecraft:iron_ingot',
        C: 'thermal:rf_coil' // RF Coil for motor!
    }).id('kubejs:upgrades/mining_speed_basic')

    event.shaped('kubejs:mining_speed_advanced', [
        'EIE',
        'MCM',
        'EIE'
    ], {
        E: 'enderio:energetic_alloy',
        M: 'kubejs:mining_speed_basic',
        C: 'thermal:rf_coil'
    }).id('kubejs:upgrades/mining_speed_advanced')

    event.shaped('kubejs:mining_speed_elite', [
        'VIV',
        'OCO',
        'VIV'
    ], {
        V: 'enderio:vibrant_alloy',
        O: 'kubejs:mining_speed_advanced',
        C: 'enderio:octadic_capacitor'
    }).id('kubejs:upgrades/mining_speed_elite')

    // Ore Scanner Upgrades
    event.shaped('kubejs:ore_scanner_basic', [
        'RGR',
        'GCG',
        'RGR'
    ], {
        R: 'minecraft:redstone',
        G: 'minecraft:glass',
        C: 'thermal:turbine_blade' // Turbine blade for scanner!
    }).id('kubejs:upgrades/ore_scanner_basic')

    event.shaped('kubejs:ore_scanner_advanced', [
        'EIE',
        'SOS',
        'EIE'
    ], {
        E: 'enderio:energetic_alloy',
        S: 'kubejs:ore_scanner_basic',
        O: 'thermal:upgrade_augment_1'
    }).id('kubejs:upgrades/ore_scanner_advanced')

    event.shaped('kubejs:ore_scanner_elite', [
        'VIV',
        'RCR',
        'VIV'
    ], {
        V: 'enderio:vibrant_alloy',
        R: 'kubejs:ore_scanner_advanced',
        C: 'enderio:octadic_capacitor'
    }).id('kubejs:upgrades/ore_scanner_elite')

    // Integrity Field (Silk Touch replacement)
    event.shaped('kubejs:integrity_field', [
        'EGE',
        'RER',
        'EGE'
    ], {
        E: 'enderio:vibrant_alloy',
        G: 'minecraft:glass',
        R: 'minecraft:redstone'
    }).id('kubejs:upgrades/integrity_field')

    // Self-Repair Nanobots (Mending replacement)
    event.shaped('kubejs:self_repair_nano', [
        'RRR',
        'RER',
        'RRR'
    ], {
        R: 'minecraft:redstone',
        E: 'enderio:energetic_alloy'
    }).id('kubejs:upgrades/self_repair')

    // Reinforced Frame (Unbreaking replacement)
    event.shaped('kubejs:reinforced_frame', [
        'IEI',
        'ECE',
        'IEI'
    ], {
        I: 'immersiveengineering:plate_steel',
        E: 'enderio:energetic_alloy',
        C: 'thermal:machine_frame'
    }).id('kubejs:upgrades/reinforced_frame')

    // Sharpness Upgrades
    event.shaped('kubejs:vibrant_edge', [
        ' V ',
        'EIE',
        ' V '
    ], {
        V: 'enderio:vibrant_alloy',
        E: 'enderio:energetic_alloy',
        I: 'minecraft:iron_ingot'
    }).id('kubejs:upgrades/vibrant_edge')

    event.shaped('kubejs:pulsating_edge', [
        ' P ',
        'EIE',
        ' P '
    ], {
        P: 'enderio:pulsating_alloy',
        E: 'kubejs:vibrant_edge',
        I: 'minecraft:iron_ingot'
    }).id('kubejs:upgrades/pulsating_edge')

    event.shaped('kubejs:energetic_edge', [
        ' N ',
        'EIE',
        ' N '
    ], {
        N: 'minecraft:netherite_ingot',
        E: 'kubejs:pulsating_edge',
        I: 'immersiveengineering:plate_steel'
    }).id('kubejs:upgrades/energetic_edge')

    // Armor Upgrades
    event.shaped('kubejs:ballistic_weave', [
        'SSS',
        'SRS',
        'SSS'
    ], {
        S: 'immersiveengineering:plate_steel',
        R: 'minecraft:redstone'
    }).id('kubejs:upgrades/ballistic_weave')

    event.shaped('kubejs:energy_shield', [
        'EEE',
        'RFR',
        'EEE'
    ], {
        E: 'enderio:energetic_alloy',
        R: 'minecraft:redstone',
        F: 'thermal:rf_coil'
    }).id('kubejs:upgrades/energy_shield')

    event.shaped('kubejs:thermal_dissipator', [
        'CCC',
        'EIE',
        'CCC'
    ], {
        C: 'immersiveengineering:plate_copper',
        E: 'enderio:end_steel',
        I: 'minecraft:iron_ingot'
    }).id('kubejs:upgrades/thermal_dissipator')

    // Other Upgrades
    event.shaped('kubejs:hydraulic_piston', [
        'PPP',
        'PRP',
        'PPP'
    ], {
        P: 'immersiveengineering:piston',
        R: 'minecraft:redstone'
    }).id('kubejs:upgrades/hydraulic_piston')

    event.shaped('kubejs:vacuum_collector', [
        'IFI',
        'ECE',
        'IFI'
    ], {
        I: 'minecraft:iron_ingot',
        F: 'minecraft:iron_bars',
        E: 'enderio:energetic_alloy',
        C: 'thermal:flux_pipe'
    }).id('kubejs:upgrades/vacuum_collector')

    event.shaped('kubejs:extender_arm', [
        'PIP',
        'ECE',
        'PIP'
    ], {
        P: 'immersiveengineering:plate_iron',
        I: 'minecraft:iron_ingot',
        E: 'enderio:energetic_alloy',
        C: 'immersiveengineering:piston'
    }).id('kubejs:upgrades/extender_arm')

    // Upgrade Kits
    event.shaped('kubejs:upgrade_kit_miner', [
        'MS',
        'S ',
        ' S'
    ], {
        M: 'kubejs:mining_speed_basic',
        S: 'kubejs:ore_scanner_basic'
    }).id('kubejs:kits/miner')

    event.shaped('kubejs:upgrade_kit_combat', [
        'VE',
        'E ',
        ' E'
    ], {
        V: 'kubejs:vibrant_edge',
        E: 'kubejs:ballistic_weave'
    }).id('kubejs:kits/combat')

    event.shaped('kubejs:upgrade_kit_survival', [
        'NR',
        'R ',
        ' R'
    ], {
        N: 'kubejs:self_repair_nano',
        R: 'kubejs:reinforced_frame'
    }).id('kubejs:kits/survival')

    console.log('VoidCore: Tech upgrade components crafted!')

})

// ============================================
// ANVIL UPGRADE SYSTEM
// ============================================
// Use vanilla anvil to apply tech upgrades to tools
// This replaces the enchantment system

// TODO: ServerEvents.anvil not available in this KubeJS version
// Anvil upgrade system disabled for now
// ServerEvents.anvil(event => {

//    console.log('VoidCore: Configuring anvil upgrade system...')
//
//    // ============================================
//    // PICKAXE UPGRADES
//    // ============================================
//
//    // Basic Motor (Efficiency I) - Iron Pickaxe
//    event.anvil('minecraft:iron_pickaxe', 'kubejs:mining_speed_basic', 'kubejs:mining_speed_basic')
//        .setDamageCost(5)
//        .setMaterialCost(1)
//
//    // Advanced Motor (Efficiency II) - Requires Basic Motor
//    event.anvil('kubejs:mining_speed_basic', 'kubejs:mining_speed_advanced', 'kubejs:mining_speed_advanced')
//        .setDamageCost(10)
//        .setMaterialCost(2)
//
//    // Elite Motor (Efficiency III) - Requires Advanced Motor
//    event.anvil('kubejs:mining_speed_advanced', 'kubejs:mining_speed_elite', 'kubejs:mining_speed_elite')
//        .setDamageCost(15)
//        .setMaterialCost(3)
//
//    // Basic Scanner (Fortune I) - Iron Pickaxe
//    event.anvil('minecraft:iron_pickaxe', 'kubejs:ore_scanner_basic', 'kubejs:ore_scanner_basic')
//        .setDamageCost(10)
//        .setMaterialCost(2)
//
//    // Advanced Scanner (Fortune II) - Requires Basic Scanner
//    event.anvil('kubejs:ore_scanner_basic', 'kubejs:ore_scanner_advanced', 'kubejs:ore_scanner_advanced')
//        .setDamageCost(15)
//        .setMaterialCost(3)
//
//    // Elite Scanner (Fortune III) - Requires Advanced Scanner
//    event.anvil('kubejs:ore_scanner_advanced', 'kubejs:ore_scanner_elite', 'kubejs:ore_scanner_elite')
//        .setDamageCost(20)
//        .setMaterialCost(4)
//
//    // Integrity Field (Silk Touch) - Any Pickaxe
//    event.anvil('minecraft:iron_pickaxe', 'kubejs:integrity_field', 'minecraft:iron_pickaxe')
//        .setDamageCost(15)
//        .setMaterialCost(3)
//
//    event.anvil('minecraft:diamond_pickaxe', 'kubejs:integrity_field', 'minecraft:diamond_pickaxe')
//        .setDamageCost(15)
//        .setMaterialCost(3)
//
//    // Self-Repair (Mending) - Any Tool
//    event.anvil('minecraft:iron_pickaxe', 'kubejs:self_repair_nano', 'minecraft:iron_pickaxe')
//        .setDamageCost(20)
//        .setMaterialCost(4)
//
//    event.anvil('minecraft:diamond_pickaxe', 'kubejs:self_repair_nano', 'minecraft:diamond_pickaxe')
//        .setDamageCost(20)
//        .setMaterialCost(4)
//
//    event.anvil('minecraft:netherite_pickaxe', 'kubejs:self_repair_nano', 'minecraft:netherite_pickaxe')
//        .setDamageCost(20)
//        .setMaterialCost(4)
//
//    // ============================================
//    // SWORD UPGRADES
//    // ============================================
//
//    // Vibrant Edge (Sharpness I) - Iron Sword
//    event.anvil('minecraft:iron_sword', 'kubejs:vibrant_edge', 'kubejs:vibrant_edge')
//        .setDamageCost(5)
//        .setMaterialCost(1)
//
//    // Pulsating Edge (Sharpness II) - Requires Vibrant
//    event.anvil('kubejs:vibrant_edge', 'kubejs:pulsating_edge', 'kubejs:pulsating_edge')
//        .setDamageCost(10)
//        .setMaterialCost(2)
//
//    // Energetic Edge (Sharpness III) - Requires Pulsating
//    event.anvil('kubejs:pulsating_edge', 'kubejs:energetic_edge', 'kubejs:energetic_edge')
//        .setDamageCost(15)
//        .setMaterialCost(3)
//
//    // Vacuum Collector (Looting) - Any Sword
//    event.anvil('minecraft:iron_sword', 'kubejs:vacuum_collector', 'minecraft:iron_sword')
//        .setDamageCost(15)
//        .setMaterialCost(3)
//
//    event.anvil('minecraft:diamond_sword', 'kubejs:vacuum_collector', 'minecraft:diamond_sword')
//        .setDamageCost(15)
//        .setMaterialCost(3)
//
//    // ============================================
//    // ARMOR UPGRADES
//    // ============================================
//
//    // Ballistic Weave (Protection) - Any Armor
//    event.anvil('minecraft:iron_chestplate', 'kubejs:ballistic_weave', 'minecraft:iron_chestplate')
//        .setDamageCost(10)
//        .setMaterialCost(2)
//
//    event.anvil('minecraft:diamond_chestplate', 'kubejs:ballistic_weave', 'minecraft:diamond_chestplate')
//        .setDamageCost(10)
//        .setMaterialCost(2)
//
//    // Energy Shield (Protection) - Requires Ballistic
//    event.anvil('kubejs:ballistic_weave', 'kubejs:energy_shield', 'kubejs:energy_shield')
//        .setDamageCost(15)
//        .setMaterialCost(3)
//
//    // Thermal Dissipator (Fire Protection) - Any Armor
//    event.anvil('minecraft:iron_chestplate', 'kubejs:thermal_dissipator', 'minecraft:iron_chestplate')
//        .setDamageCost(10)
//        .setMaterialCost(2)
//
//    event.anvil('minecraft:diamond_chestplate', 'kubejs:thermal_dissipator', 'minecraft:diamond_chestplate')
//        .setDamageCost(10)
//        .setMaterialCost(2)
//
//    console.log('VoidCore: Anvil upgrade system configured!')

// })
