// server_scripts/jetpack_fuel_system.js
// VoidCore: Skybound Engineering
// Destabilized Redstone Jetpack Fuel System
// Uses molten redstone as jetpack fuel (Thermal-style)

ServerEvents.recipes(event => {

    console.log('VoidCore: Setting up destabilized redstone jetpack fuel system...')

    // ============================================
    // MELT REDSTONE INTO DESTABILIZED REDSTONE
    // ============================================

    // Melt redstone in any heating device to create destabilized redstone
    // Using Tinkers Smeltery for consistency
    event.custom({
        type: 'tconstruct:melting',
        ingredient: { tag: 'forge:dusts/redstone' },
        result: { fluid: 'kubejs:destabilized_redstone', amount: 250 }, // 1 redstone = 250 mB
        temperature: 800,
        time: 50
    }).id('kubejs:melting/redstone_to_destabilized')

    // Also allow redstone blocks (more efficient)
    event.custom({
        type: 'tconstruct:melting',
        ingredient: { tag: 'forge:storage_blocks/redstone' },
        result: { fluid: 'kubejs:destabilized_redstone', amount: 1000 }, // 1 block = 1000 mB (4x efficient)
        temperature: 800,
        time: 100
    }).id('kubejs:melting/redstone_block_to_destabilized')

    // ============================================
    // DESTABILIZED REDSTONE BUCKET
    // ============================================

    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'forge:empty_bottle' },
        fluid: { fluid: 'kubejs:destabilized_redstone', amount: 1000 },
        result: 'kubejs:bucket_destabilized_redstone',
        coolingTime: 50
    }).id('kubejs:casting/destabilized_redstone_bucket')

    // ============================================
    // REMOVE OLD ELECTRIC JETPACK RECIPE
    // ============================================

    event.remove({ output: 'kubejs:backpack_jetpack' })

    // ============================================
    // NEW FUEL-BASED JETPACK BACKPACK RECIPE
    // ============================================

    // Flight Backpack requires Sophisticated Backpack + Jetpack + Fuel Tank
    event.shaped('kubejs:backpack_jetpack', [
        ' F ',
        'BF ',
        ' F '
    ], {
        F: 'kubejs:bucket_destabilized_redstone', // Full fuel tank!
        B: 'kubejs:backpack_sophisticated',    // Requires upgraded backpack
        space: 'inventoryessential:jetpack_upgrade' // Jetpack upgrade
    }).id('kubejs:jetpack_fuel_based')

    // ============================================
    // REFUELING SYSTEM
    // ============================================

    // Craft an empty fuel tank (can be attached to backpack)
    event.shaped('kubejs:jetpack_fuel_tank_empty', [
        'ICI',
        'I I',
        'ICI'
    ], {
        I: 'iron_ingot',
        C: 'minecraft:chest'
    }).id('kubejs:jetpack_fuel_tank')

    // Fill empty tank with destabilized redstone
    event.custom({
        type: 'tconstruct:casting_table',
        cast: { item: 'kubejs:jetpack_fuel_tank_empty' },
        fluid: { fluid: 'kubejs:destabilized_redstone', amount: 4000 }, // 4 buckets worth
        result: 'kubejs:jetpack_fuel_tank_full',
        coolingTime: 50
    }).id('kubejs:casting/jetpack_fuel_tank_fill')

    // ============================================
    // ENDER TANK INTEGRATION (Infinite Flight)
    // ============================================

    // Attach Ender Tank to backpack for infinite fuel
    event.shaped('kubejs:backpack_jetpack_infinite', [
        'E',
        'B',
        'E'
    ], {
        E: 'enderstorage:ender_tank',
        B: 'kubejs:backpack_jetpack',
        space: 'kubejs:jetpack_fuel_tank_full'
    }).id('kubejs:jetpack_infinite_upgrade')

    console.log('VoidCore: Jetpack fuel system configured!')
    console.log('VoidCore: 1 bucket = 5 minutes flight')
    console.log('VoidCore: Ender Tank = infinite flight')
})

// ============================================
// JETPACK FUEL CONSUMPTION
// ============================================

// When wearing Flight Backpack, consume destabilized redstone fuel
// This is handled by Inventory Essentials mod
// Fuel consumption rate: 1000 mB per 5 minutes = 3.33 mB per second

console.log('VoidCore: Jetpack fuel consumption: 1000 mB per 5 minutes')
