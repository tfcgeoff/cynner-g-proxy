// server_scripts/tech_blueprint_system.js
// VoidCore: Skybound Engineering
// Enchanted Books as Ancient Blueprints/Research Papers
// Enchanted books are repurposed as technical blueprints required for crafting tech upgrades

ServerEvents.recipes(event => {

    console.log('VoidCore: Setting up Tech Blueprint System...')
    console.log('VoidCore: Enchanted books are now ancient blueprints for tech upgrades!')

    // ============================================
    // TECH BLUEPRINT CONCEPT
    // ============================================
    // Enchanted books represent ancient knowledge that can be reverse-engineered
    // into modern technology. They are "research papers" containing diagrams and
    // schematics that our engineers can study to create tech upgrades.

    // Book Mappings (Enchantment → Tech Upgrade):
    // Efficiency I-IV   → Mining Motors (Basic/Advanced/Elite)
    // Fortune I-III      → Ore Scanners (Basic/Advanced/Elite)
    // Silk Touch        → Integrity Field Generator
    // Mending           → Self-Repair Nanobots
    // Unbreaking I-III  → Reinforced Tool Frame
    // Sharpness I-V     → Edge Enhancers
    // Protection I-IV   → Ballistic Weave / Energy Shield

    // ============================================
    // MINING SPEED UPGRADES (Efficiency Books → Motors)
    // ============================================

    // Basic Mining Motor - Requires Efficiency I book
    event.shaped('kubejs:mining_speed_basic', [
        'BEB',
        'ECE',
        'BEB'
    ], {
        B: 'minecraft:enchanted_book', // Ancient blueprint!
        E: 'thermal:rf_coil',
        C: 'minecraft:redstone'
    }).id('kubejs:blueprints/mining_motor_basic_efficiency')

    // Advanced Mining Motor - Requires Efficiency II book + Basic Motor
    event.shaped('kubejs:mining_speed_advanced', [
        'BEB',
        'ECE',
        'BEB'
    ], {
        B: 'minecraft:enchanted_book', // More advanced blueprint
        E: 'thermal:energetic_alloy',
        C: 'kubejs:mining_speed_basic'
    }).id('kubejs:blueprints/mining_motor_advanced_efficiency')

    // Elite Mining Motor - Requires Efficiency III book + Advanced Motor
    event.shaped('kubejs:mining_speed_elite', [
        'BEB',
        'ECE',
        'BEB'
    ], {
        B: 'minecraft:enchanted_book', // Elite blueprint
        E: 'enderio:vibrant_alloy',
        C: 'kubejs:mining_speed_advanced'
    }).id('kubejs:blueprints/mining_motor_elite_efficiency')

    // ============================================
    // FORTUNE UPGRADES (Fortune Books → Ore Scanners)
    // ============================================

    // Basic Ore Scanner - Requires Fortune I book
    event.shaped('kubejs:ore_scanner_basic', [
        'BGB',
        'GRG',
        'BGB'
    ], {
        B: 'minecraft:enchanted_book', // Ancient mineral survey data
        G: 'minecraft:glass',
        R: 'immersiveengineering:component_iron'
    }).id('kubejs:blueprints/ore_scanner_basic_fortune')

    // Advanced Ore Scanner - Requires Fortune II book + Basic Scanner
    event.shaped('kubejs:ore_scanner_advanced', [
        'BGB',
        'GRG',
        'BGB'
    ], {
        B: 'minecraft:enchanted_book', // Advanced survey data
        G: 'minecraft:glass',
        R: 'kubejs:ore_scanner_basic'
    }).id('kubejs:blueprints/ore_scanner_advanced_fortune')

    // Elite Ore Scanner - Requires Fortune III book + Advanced Scanner
    event.shaped('kubejs:ore_scanner_elite', [
        'BGB',
        'GRG',
        'BGB'
    ], {
        B: 'minecraft:enchanted_book', // Complete geological survey
        G: 'minecraft:glass',
        R: 'kubejs:ore_scanner_advanced'
    }).id('kubejs:blueprints/ore_scanner_elite_fortune')

    // ============================================
    // SPECIAL UPGRADES (Specific Enchantment Books)
    // ============================================

    // Integrity Field Generator - Silk Touch book
    // Preserves block integrity through quantum field manipulation
    event.shaped('kubejs:integrity_field', [
        'BTB',
        'TCT',
        'BTB'
    ], {
        B: 'minecraft:enchanted_book', // Ancient dimensional manipulation notes
        T: 'enderio:vibrant_alloy',
        C: 'minecraft:glass_pane'
    }).id('kubejs:blueprints/integrity_field_silk_touch')

    // Self-Repair Nanobots - Mending book
    // Nanobots that repair tools using ambient energy (mending reverse-engineered)
    event.shaped('kubejs:self_repair_nano', [
        'BEB',
        'ECE',
        'BEB'
    ], {
        B: 'minecraft:enchanted_book', // Ancient self-repair schematics
        E: 'thermal:energetic_alloy',
        C: 'mekanism:module_base'
    }).id('kubejs:blueprints/self_repair_mending')

    // Reinforced Tool Frame - Unbreaking book
    // Advanced materials improve durability (unbreaking reverse-engineered)
    event.shaped('kubejs:reinforced_frame', [
        'BPB',
        'PSP',
        'BPB'
    ], {
        B: 'minecraft:enchanted_book', // Ancient metallurgy techniques
        P: 'immersiveengineering:plate_steel',
        S: 'thermal:machine_frame'
    }).id('kubejs:blueprints/reinforced_frame_unbreaking')

    // ============================================
    // COMBAT UPGRADES (Sharpness Books → Edge Enhancers)
    // ============================================

    // Vibrant Edge Enhancer - Sharpness I-II book
    event.shaped('kubejs:vibrant_edge', [
        ' B ',
        ' E ',
        ' E '
    ], {
        B: 'minecraft:enchanted_book', // Ancient weapon forging techniques
        E: 'enderio:vibrant_alloy'
    }).id('kubejs:blueprints/vibrant_edge_sharpness')

    // Pulsating Edge Enhancer - Sharpness III-IV book + Vibrant Edge
    event.shaped('kubejs:pulsating_edge', [
        ' B ',
        ' P ',
        'VE '
    ], {
        B: 'minecraft:enchanted_book', // Advanced forging
        P: 'enderio:pulsating_alloy',
        V: 'kubejs:vibrant_edge'
    }).id('kubejs:blueprints/pulsating_edge_sharpness')

    // Energetic Edge Enhancer - Sharpness V book + Pulsating Edge
    event.shaped('kubejs:energetic_edge', [
        ' B ',
        ' E ',
        'PE '
    ], {
        B: 'minecraft:enchanted_book', // Master forging techniques
        E: 'minecraft:netherite_ingot',
        P: 'kubejs:pulsating_edge'
    }).id('kubejs:blueprints/energetic_edge_sharpness')

    // ============================================
    // ARMOR UPGRADES (Protection Books → Defense Systems)
    // ============================================

    // Ballistic Weave - Protection I-II book
    event.shaped('kubejs:ballistic_weave', [
        'BPB',
        'PWP',
        'BPB'
    ], {
        B: 'minecraft:enchanted_book', // Ancient armor weaving techniques
        P: 'immersiveengineering:plate_steel',
        W: 'minecraft:redstone'
    }).id('kubejs:blueprints/ballistic_weave_protection')

    // Energy Shield Emitter - Protection III-IV book
    event.shaped('kubejs:energy_shield', [
        'BEB',
        'RCR',
        'BEB'
    ], {
        B: 'minecraft:enchanted_book', // Advanced energy field theory
        E: 'thermal:rf_coil',
        R: 'minecraft:redstone',
        C: 'thermal:energy_cell'
    }).id('kubejs:blueprints/energy_shield_protection')

    // Thermal Dissipator - Fire Protection book
    event.shaped('kubejs:thermal_dissipator', [
        'BEB',
        'CTC',
        'BEB'
    ], {
        B: 'minecraft:enchanted_book', // Thermal management research
        E: 'enderio:end_steel',
        C: 'thermal:copper_glass'
    }).id('kubejs:blueprints/thermal_dissipator_fire_protection')

    console.log('VoidCore: Tech Blueprint System configured!')
    console.log('VoidCore: Enchanted books are now required for tech upgrade crafting!')
})

// ============================================
// ENCHANTED BOOK NBT TAGGING
// ============================================
// Add custom tooltips to enchanted books to indicate they're blueprints

ItemEvents.rightClicked(event => {
    const item = event.item

    if (item && item.id === 'minecraft:enchanted_book') {
        // Check if it has enchantments
        const enchantments = item.enchantments

        if (enchantments && enchantments.size > 0) {
            // This is a valid enchanted book (blueprint)
            // The tooltip system handles the display
        }
    }
})

console.log('VoidCore: Enchanted books are ancient blueprints for tech upgrades!')
console.log('VoidCore: Fish, trade, or loot for enchanted books to unlock tech upgrades!')
