// server_scripts/difficulty_system.js
// VoidCore: Skybound Engineering
// One-time Difficulty Selection System

// Persistent data to track if difficulty has been set
const DIFFICULTY_SET_KEY = 'voidcore_difficulty_set'
const DIFFICULTY_LEVEL_KEY = 'voidcore_difficulty_level'

// Difficulty levels
const DIFFICULTY = {
    CHALLENGING: 'challenging',
    VERY_CHALLENGING: 'very_challenging',
    BRUTAL: 'brutal'
}

// Mob health multipliers per difficulty
const MOB_HEALTH_MULTIPLIERS = {
    'challenging': 1.0,      // Normal: ~24 HP (zombie)
    'very_challenging': 1.4, // Tougher: ~34 HP (zombie)
    'brutal': 1.8            // Brutal: ~43 HP (zombie)
}

// Lava cost multipliers per difficulty
const LAVA_COST_MULTIPLIERS = {
    'challenging': 1.0,      // 100 emeralds
    'very_challenging': 1.5, // 150 emeralds
    'brutal': 2.0            // 200 emeralds
}

// Difficulty System loaded (startup log above)

// ============================================
// DIFFICULTY CRAFTED - Set when crystal is crafted
// ============================================

ServerEvents.recipes(event => {
    console.log('VoidCore: Difficulty recipes configured...')

    // Remove any default difficulty crystal recipes (if they exist)
    event.remove({ output: 'kubejs:difficulty_crystal' })

    // Difficulty Crystal recipe (should be craftable early)
    event.shaped('kubejs:difficulty_crystal', [
        'RDR',
        'DEP',
        'RCR'
    ], {
        R: 'minecraft:redstone',
        D: 'minecraft:diamond',
        E: 'minecraft:ender_pearl',
        P: 'minecraft:purple_dye',
        C: 'minecraft:clock'
    }).id('kubejs:difficulty_crystal')

    console.log('VoidCore: Difficulty Crystal recipe added...')
})

// ============================================
// DIFFICULTY CRYSTAL RIGHT-CLICK - Set difficulty once
// ============================================

ServerEvents.tick(event => {
    // Only process on server side
    if (event.server === undefined) return

    // Get all players
    const players = event.server.players

    players.forEach(player => {
        // Check if player is holding difficulty crystal in main hand
        const mainHandItem = player.getMainHandItem()
        if (mainHandItem.id !== 'kubejs:difficulty_crystal') return

        // Check if player is sneaking and right-clicking
        if (!player.shiftKey) return

        // Get persistent data for this world
        const persistentData = event.server.getPersistentData()

        // Check if difficulty has already been set
        if (persistentData.contains(DIFFICULTY_SET_KEY) && persistentData.getBoolean(DIFFICULTY_SET_KEY)) {
            player.tell('[§cVoidCore§r] Difficulty has already been set for this world!')
            return
        }

        // Open difficulty selection GUI (or cycle through difficulties)
        // For now, we'll use a simple cycle system
        const currentDifficulty = persistentData.getString(DIFFICULTY_LEVEL_KEY) || DIFFICULTY.CHALLENGING

        let nextDifficulty
        let difficultyName

        switch (currentDifficulty) {
            case DIFFICULTY.CHALLENGING:
                nextDifficulty = DIFFICULTY.VERY_CHALLENGING
                difficultyName = '§eVery Challenging§r'
                break
            case DIFFICULTY.VERY_CHALLENGING:
                nextDifficulty = DIFFICULTY.BRUTAL
                difficultyName = '§cBrutal§r'
                break
            case DIFFICULTY.BRUTAL:
                nextDifficulty = DIFFICULTY.CHALLENGING
                difficultyName = '§aChallenging§r'
                break
            default:
                nextDifficulty = DIFFICULTY.CHALLENGING
                difficultyName = '§aChallenging§r'
        }

        // Store the next difficulty (not yet set)
        persistentData.putString(DIFFICULTY_LEVEL_KEY, nextDifficulty)

        player.tell('[§6VoidCore§r] Next difficulty: ' + difficultyName)
        player.tell('[§6VoidCore§r] Shift + Right-click again to cycle, Shift + Right-click in air to confirm!')
    })
})

// ============================================
// CONFIRM DIFFICULTY - Right-click in air to lock in
// ============================================

ServerEvents.tick(event => {
    if (event.server === undefined) return

    const players = event.server.players

    players.forEach(player => {
        const mainHandItem = player.getMainHandItem()
        if (mainHandItem.id !== 'kubejs:difficulty_crystal') return

        // Check if player is right-clicking in air (not sneaking)
        if (player.shiftKey) return // Skip if sneaking (that's for cycling)

        // Get persistent data
        const persistentData = event.server.getPersistentData()

        // Check if already set
        if (persistentData.contains(DIFFICULTY_SET_KEY) && persistentData.getBoolean(DIFFICULTY_SET_KEY)) {
            player.tell('[§cVoidCore§r] Difficulty has already been set!')
            return
        }

        // Get current selected difficulty
        const selectedDifficulty = persistentData.getString(DIFFICULTY_LEVEL_KEY) || DIFFICULTY.CHALLENGING

        // Lock it in!
        persistentData.putBoolean(DIFFICULTY_SET_KEY, true)
        persistentData.putString(DIFFICULTY_LEVEL_KEY, selectedDifficulty)

        // Consume the crystal
        mainHandItem.count--
        player.getMainHandItem().count = mainHandItem.count

        // Announce to all players
        const server = event.server
        const difficultyName = selectedDifficulty === DIFFICULTY.CHALLENGING ? '§aChallenging§r' :
                             selectedDifficulty === DIFFICULTY.VERY_CHALLENGING ? '§eVery Challenging§r' :
                             selectedDifficulty === DIFFICULTY.BRUTAL ? '§cBrutal§r' : selectedDifficulty

        server.playerList.broadcast('[§6VoidCore§r] World difficulty set to: ' + difficultyName)
        server.playerList.broadcast('[§6VoidCore§r] This cannot be changed!')

        console.log('VoidCore: World difficulty set to ' + selectedDifficulty)
    })
})

// ============================================
// MOB SPAWN - Scale health based on difficulty
// ============================================

// TODO: ServerEvents.entitySpawned not available in this KubeJS version
// Mob health scaling disabled for now

// ServerEvents.entitySpawned(event => {
//     // Only scale hostile mobs
//     if (!event.entity.isLiving()) return
//     if (!event.entity.type.category === 'monster') return
//
//     // Get persistent data
//     const persistentData = event.server.getPersistentData()
//
//     // Get current difficulty
//     const difficulty = persistentData.getString(DIFFICULTY_LEVEL_KEY) || DIFFICULTY.CHALLENGING
//
//     // Get health multiplier
//     const multiplier = MOB_HEALTH_MULTIPLIERS[difficulty] || 1.0
//
//     // Only apply if not challenging (normal)
//     if (multiplier === 1.0) return
//
//     // Scale max health
//     const entity = event.entity
//     const baseMaxHealth = entity.getMaxHealth()
//     const newMaxHealth = Math.floor(baseMaxHealth * multiplier)
//
//     entity.setMaxHealth(newMaxHealth)
//     entity.setHealth(newMaxHealth)
// })

console.log('VoidCore: Difficulty System initialized!')
