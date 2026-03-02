// server_scripts/storage_integration.js
// VoidCore: Skybound Engineering
// Storage Integration - Iron Chests & Storage Drawers (Tech Only)

ServerEvents.recipes(event => {

    console.log('VoidCore: Integrating storage systems...')

    // ============================================
    // IRON CHESTS - PROGRESSIVE STORAGE
    // ============================================
    // Bigger chests for skyblock - TECH progression

    // Iron Chest
    event.remove({ output: 'ironchest:iron_chest' })
    event.shaped('ironchest:iron_chest', [
        'III',
        'ICI',
        'III'
    ], {
        I: 'minecraft:iron_ingot',
        C: 'minecraft:chest'
    }).id('kubejs:storage/iron_chest')

    // Gold Chest
    event.remove({ output: 'ironchest:gold_chest' })
    event.shaped('ironchest:gold_chest', [
        'GGG',
        'GCG',
        'GGG'
    ], {
        G: 'minecraft:gold_ingot',
        C: 'ironchest:iron_chest' // Upgrade from iron!
    }).id('kubejs:storage/gold_chest')

    // Diamond Chest
    event.remove({ output: 'ironchest:diamond_chest' })
    event.shaped('ironchest:diamond_chest', [
        'DDD',
        'DCD',
        'DDD'
    ], {
        D: 'minecraft:diamond',
        C: 'ironchest:gold_chest', // Upgrade from gold!
        S: 'immersiveengineering:plate_steel' // Requires steel!
    }).id('kubejs:storage/diamond_chest_gated')

    // Crystal Chest (transparent - tech!)
    event.remove({ output: 'ironchest:crystal_chest' })
    event.shaped('ironchest:crystal_chest', [
        'GGG',
        'GCG',
        'GGG'
    ], {
        G: 'minecraft:glass', // Transparent!
        C: 'ironchest:diamond_chest',
        E: 'enderio:vibrant_alloy' // Vibrant alloy makes it transparent!
    }).id('kubejs:storage/crystal_chest_gated')

    // Obsidian Chest (blast resistant)
    event.remove({ output: 'ironchest:obsidian_chest' })
    event.shaped('ironchest:obsidian_chest', [
        'OOO',
        'OCO',
        'OOO'
    ], {
        O: 'minecraft:obsidian',
        C: 'ironchest:diamond_chest',
        I: 'immersiveengineering:plate_steel'
    }).id('kubejs:storage/obsidian_chest')

    // ============================================
    // STORAGE DRAWERS - COMPACT STORAGE
    // ============================================
    // Store large quantities of one item type

    // Basic Drawer
    event.remove({ output: 'storagedrawers:oak_drawer' })
    event.shaped('storagedrawers:oak_drawer', [
        'W',
        'C',
        'W'
    ], {
        W: 'minecraft:oak_planks',
        C: 'minecraft:chest'
    }).id('kubejs:storage/basic_drawer')

    // Drawer Controller (automation interface)
    event.remove({ output: 'storagedrawers:controller' })
    event.shaped('storagedrawers:controller', [
        'RTR',
        'ECE',
        'RTR'
    ], {
        R: 'minecraft:redstone',
        T: 'immersiveengineering:conveyor_basic', // Conveyors!
        E: 'enderio:basic_capacitor', // Capacitor!
        C: 'minecraft:chest'
    }).id('kubejs:storage/drawer_controller_gated')

    // Drawer Key (locks drawers)
    event.remove({ output: 'storagedrawers:drawer_key' })
    event.shaped('storagedrawers:drawer_key', [
        ' I ',
        ' I ',
        ' S '
    ], {
        I: 'minecraft:iron_ingot',
        S: 'minecraft:stick'
    }).id('kubejs:storage/drawer_key')

    // Upgrade Template (quality upgrades)
    event.remove({ output: 'storagedrawers:upgrade_template' })
    event.shaped('storagedrawers:upgrade_template', [
        'SIS',
        'ITI',
        'SIS'
    ], {
        S: 'minecraft:stick',
        I: 'minecraft:iron_ingot',
        T: 'thermal:machine_frame' // Machine Core!
    }).id('kubejs:storage/upgrade_template_gated')

    // Trim (storage capacity upgrade)
    event.remove({ output: 'storagedrawers:trim' })
    event.shaped('storagedrawers:trim', [
        'SSS',
        'SCS',
        'SSS'
    ], {
        S: 'immersiveengineering:plate_steel', // Steel plates!
        C: 'enderio:basic_capacitor' // Capacitor!
    }).id('kubejs:storage/trim_gated')

    // ============================================
    // VOID STORAGE (Deletes items)
    // ============================================
    // Tech trash disposal

    event.remove({ output: 'storagedrawers:void_drawer' })
    event.shaped('storagedrawers:void_drawer', [
        'EOE',
        'OVO',
        'EOE'
    ], {
        E: 'enderio:vibrant_alloy',
        O: 'minecraft:obsidian',
        V: 'minecraft:lava_bucket' // Lava consumes items!
    }).id('kubejs:storage/void_drawer_gated')

    console.log('VoidCore: Storage systems integrated!')
    console.log('VoidCore: Progressive chests gated behind materials!')
    console.log('VoidCore: Drawer automation requires tech!')

})
