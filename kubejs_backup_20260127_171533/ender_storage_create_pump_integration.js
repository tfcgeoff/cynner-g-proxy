// server_scripts/ender_storage_create_pump_integration.js
// VoidCore: Skybound Engineering
// Ender Storage 2 + Lava Infusion Pump integration
// NOTE: Create mod excluded due to Sodium/flywheel conflict
// Using custom Lava Infusion Pump instead

ServerEvents.recipes(event => {

    console.log('VoidCore: Integrating Ender Storage 2 with Lava Infusion Pump...')

    // ============================================
    // REMOVE VANILLA CHEST RECIPE
    // ============================================

    // Remove vanilla chest recipe
    event.remove({ type: 'minecraft:crafting_table', output: 'minecraft:chest' })
    event.remove({ type: 'minecraft:crafting', output: 'minecraft:chest' })

    // ============================================
    // TIER 2: ENDER CHEST (replace vanilla chests)
    // ============================================

    // Remove default Ender Chest recipe (we'll gate it)
    event.remove({ type: 'enderstorage:ender_chest' })

    // Gated Ender Chest recipe (mid-game unlock)
    event.shaped('enderstorage:ender_chest', [
        'RSI',
        'SCS',
        'RSI'
    ], {
        R: 'minecraft:redstone',
        S: 'minecraft:string',
        I: 'minecraft:iron_ingot',
        C: 'kubejs:rs_upgrade_chip' // Requires Refined Storage Upgrade Chip!
    }).id('kubejs:storage/ender_chest_gated')

    // ============================================
    // TIER 2: ENDER TANK (for lava storage)
    // ============================================

    // Remove default Ender Tank recipe (we'll gate it)
    event.remove({ type: 'enderstorage:ender_tank' })

    // Gated Ender Tank recipe (requires IE components)
    event.shaped('enderstorage:ender_tank', [
        'TFT',
        'CEC',
        'TFT'
    ], {
        T: 'immersiveengineering:plate_tin',
        F: 'minecraft:furnace',
        C: 'enderio:basic_capacitor',
        E: 'immersiveengineering:electron_tube'
    }).id('kubejs:storage/ender_tank_gated')

    // ============================================
    // TIER 3: LAVA INFUSION PUMP (Replaces Create)
    // ============================================

    // NOTE: Create mod excluded due to Sodium/flywheel conflict
    // Lava Infusion Pump recipe is in recipes.js
    // Usage: Right-click with 10k+ lava blocks nearby to link Ender Tank

    // ============================================
    // INFRASTRUCTURE RECIPES
    // ============================================

    // IE Fluid Pipe recipe (connects Ender Tank to machines)
    event.shaped('immersiveengineering:fluid_pipe', [
        'PIP',
        'IPI',
        'PIP'
    ], {
        P: 'immersiveengineering:stick_treated_wood',
        I: 'immersiveengineering:iron_ingot'
    }).id('kubejs:storage/ie_fluid_pipe')

    // ============================================
    // CROSS-MOD: ENDER TANK + IE PIPES
    // ============================================

    // Recipe to connect Ender Tank with IE Fluid Pipes
    // Example: Create a connection interface item

    // Recipe: Fluid Export Cable (Ender Tank → IE Pipe)
    event.shaped('kubejs:fluid_export_cable', [
        'ECE',
        'EPE',
        'ECE'
    ], {
        E: 'enderstorage:ender_tank',
        C: 'enderstorage:ender_fluid_pipe',
        P: 'immersiveengineering:fluid_pipe',
        space: 'kubejs:starter_circuit'
    }).id('kubejs:storage/fluid_export_cable')

    // ============================================
    // NETHER TRANSPORT INFRASTRUCTURE
    // ============================================

    // Early game: Manual bucket transport
    // Mid game: Lava Infusion Pump + Ender Tank (infinite lava)
    // Late game: Automated transport via Ender Tanks

    console.log('VoidCore: Ender Storage 2 + Lava Infusion Pump integrated!')
    console.log('VoidCore: Lava infrastructure system ready!')
})
