// server_scripts/skyblock_setup.js
// VoidCore: Skyblock Initialization Script
// Runs once when server loads to create the starting platform

ServerEvents.loaded(event => {
    const server = event.server

    console.log('VoidCore: Checking if skyblock setup needed...')

    // Check if setup has already been completed by checking the scoreboard
    // We'll run a command to check, and if it fails, we know setup hasn't run yet
    try {
        const scoreResult = server.runCommandSilent('scoreboard players test Global init_check 1')
        // If this succeeds, setup has already been done
        console.log('VoidCore: Skyblock setup already completed, skipping.')
        return
    } catch (e) {
        // Command failed, setup hasn't been done yet
        console.log('VoidCore: Starting skyblock world setup...')
    }

    // Run the setup commands in sequence
    const commands = [
        // Initialize scoreboard
        'scoreboard objectives add init_check dummy',

        // Initial messages
        'tellraw @a {"text":"[System] Global init check passed. Creating world...","color":"yellow"}',
        'clear @a',
        'difficulty hard',

        // Clear environment
        'weather clear',
        'time set day',
        'gamerule doWeatherCycle false',
        'gamerule doMobSpawning false',

        // Wipe the area
        'fill -2 99 -2 2 110 2 minecraft:air',
        'kill @e[type=!player]',

        // Feedback
        'tellraw @a {"text":"[System] Generating Grass Island and Birch Tree...","color":"green"}',

        // Create the platform
        'fill -1 100 -1 1 100 1 minecraft:grass_block',

        // Place birch sapling
        'setblock 1 101 1 minecraft:birch_sapling',
        // Give player 2 bonemeal to grow the tree
        'give @a minecraft:bone_meal 2',

        // World settings
        'setworldspawn 0 100 0',
        'gamerule spawnRadius 0',
        'tp @a 1.5 109 1.5',

        // Re-enable spawning
        'gamerule doMobSpawning true',

        // Mark as complete
        'scoreboard players set Global init_check 1',

        // Visual start screen
        'title @a times 20 100 20',
        'title @a subtitle {"text":"Survival in the Void Begins...","color":"gray","italic":true}',
        'title @a title {"text":"VoidCorePack","color":"gold","bold":true}',
        'execute as @a at @s run playsound minecraft:ui.toast.challenge_complete master @s ~ ~ ~ 1 0.8'
    ]

    // Execute commands immediately (no setTimeout in server context)
    commands.forEach((cmd) => {
        try {
            server.runCommandSilent(cmd)
        } catch (e) {
            console.log(`VoidCore: Command failed: ${cmd} - ${e}`)
        }
    })

    console.log('VoidCore: Skyblock setup commands executed!')
})
