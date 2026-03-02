// server_scripts/remove_magical_content.js
// VoidCore: Skybound Engineering
// Remove Magical Content - Enchanting, Brewing, Magical Trades
// NOTE: Enchanted books are now "ancient blueprints" for tech upgrades!

ServerEvents.recipes(event => {

    console.log('VoidCore: Removing magical content...')

    // ============================================
    // REMOVE ENCHANTING SYSTEM
    // ============================================

    // Remove enchanting table recipe (players can't craft new ones)
    event.remove({ output: 'minecraft:enchanting_table' })

    // Remove enchanting system (can't enchant items at tables)
    event.remove({ type: 'minecraft:enchanting' })

    // Remove book enchanting (prevent any enchantment application)
    event.remove({ type: 'enchanting' })

    console.log('VoidCore: Enchanting table removed! (Books are now blueprints)')

    // ============================================
    // REMOVE BREWING SYSTEM
    // ============================================

    // Remove brewing stand recipe
    event.remove({ output: 'minecraft:brewing_stand' })

    // Remove all brewing recipes
    event.remove({ type: 'minecraft:brewing' })
    event.remove({ mod: 'brewing' })

    console.log('VoidCore: Brewing removed!')

    // ============================================
    // REMOVE MAGICAL ITEMS
    // ============================================

    // Thermal's Charm items (magical)
    event.remove({ mod: 'thermal', output: '/charm/' })

    console.log('VoidCore: Thermal charms removed!')

})

// ============================================
// ENCHANTED BOOKS ARE NOW BLUEPRINTS!
// ============================================
// Do NOT remove enchanted books from loot tables
// They are required as "ancient blueprints" for crafting tech upgrades
//
// Enchanted books can be obtained from:
// - Chest loot (dungeons, mineshafts, etc.)
// - Fishing (including IE Fishing)
// - Villager trading (as "research papers")
// - Mob drops (rare)
//
// Book Mappings:
// Efficiency I-IV   → Mining Motors (Basic/Advanced/Elite)
// Fortune I-III      → Ore Scanners (Basic/Advanced/Elite)
// Silk Touch        → Integrity Field Generator
// Mending           → Self-Repair Nanobots
// Unbreaking I-III  → Reinforced Tool Frame
// Sharpness I-V     → Edge Enhancers (Vibrant/Pulsating/Energetic)
// Protection I-IV   → Ballistic Weave / Energy Shield
// Fire Protection   → Thermal Dissipator

console.log('VoidCore: Magical content removal configured!')
console.log('VoidCore: Enchanting tables, brewing stands removed')
console.log('VoidCore: Enchanted books are now ANCIENT BLUEPRINTS for tech upgrades!')
console.log('VoidCore: See tech_blueprint_system.js for blueprint recipes')
