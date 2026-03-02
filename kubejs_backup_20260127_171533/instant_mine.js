// server_scripts/instant_mine.js
// VoidCore: Skybound Engineering
// Instant Mine Block Mechanics - "Place and Forget"

// ============================================
// INSTANT MINE BLOCK DATA STORAGE
// ============================================

// Store active instant mine blocks with their properties
// Format: Map<"x,y,z", {tier, radius, lastMineTime}>
const activeInstantMineBlocks = new Map()

// ============================================
// INSTANT MINE BLOCK PLACEMENT - AUTO ACTIVATE
// ============================================

BlockEvents.placed(event => {
    const block = event.block
    const player = event.player

    // Check which tier of instant mine block was placed
    let radius = 0
    let tier = 0
    let tierName = ''

    if (block.id === 'kubejs:instant_mine_t1') {
        radius = 4
        tier = 1
        tierName = 'Basic'
    } else if (block.id === 'kubejs:instant_mine_t2') {
        radius = 32
        tier = 2
        tierName = 'Advanced'
    } else if (block.id === 'kubejs:instant_mine_t3') {
        radius = 96
        tier = 3
        tierName = 'Elite'
    } else if (block.id === 'kubejs:instant_mine_t4') {
        radius = 999  // Dimensional (effectively infinite)
        tier = 4
        tierName = 'Dimensional'
    } else {
        return  // Not an instant mine block
    }

    // Auto-activate on placement
    const key = `${block.x},${block.y},${block.z}`
    activeInstantMineBlocks.set(key, {
        tier: tier,
        radius: radius,
        lastMineTime: 0,
        enabled: true
    })

    // Notify player
    player.tell(`§a${tierName} Instant Mine Block activated!§r`)
    player.tell(`§eAutomatically mining blocks in ${radius}-block radius§r`)
    player.tell(`§7Break the block to deactivate§r`)

    // Play activation sound
    event.level.playSound(
        null,
        block.x,
        block.y,
        block.z,
        'minecraft:block.amethyst_block.chime',
        'minecraft:block',
        1.0,
        1.5
    )
})

// ============================================
// INSTANT MINE BLOCK REMOVAL
// ============================================

BlockEvents.broken(event => {
    const block = event.block

    // Check if it's an instant mine block
    if (block.id.startsWith('kubejs:instant_mine_t')) {
        const key = `${block.x},${block.y},${block.z}`

        if (activeInstantMineBlocks.has(key)) {
            activeInstantMineBlocks.delete(key)
            event.player.tell('§cInstant Mine Block deactivated§r')
        }
    }
})

// ============================================
// SERVER TICK - AUTOMATIC MINING
// ============================================

ServerEvents.tick(event => {
    // Only process every 20 ticks (1 second) to prevent lag
    if (event.server.tickCount % 20 !== 0) {
        return
    }

    // Process each active instant mine block
    activeInstantMineBlocks.forEach((data, key) => {
        if (!data.enabled) {
            return
        }

        // Parse coordinates
        const [x, y, z] = key.split(',').map(Number)

        // Get the level (dimension) for this block
        // Note: This is a simplified version - in practice, you'd need to
        // track which level/dimension each block is in
        // For now, we'll process all blocks in the overworld

        const level = event.server.getLevel(0)  // 0 = overworld

        if (!level) {
            return
        }

        // Get the center block
        const centerBlock = level.getBlock(x, y, z)

        // Check if block still exists
        if (!centerBlock || !centerBlock.id.startsWith('kubejs:instant_mine_t')) {
            activeInstantMineBlocks.delete(key)
            return
        }

        // Mine blocks in radius
        let minedCount = 0
        const maxBlocksPerTick = Math.min(data.radius, 50)  // Limit to prevent lag

        // Scan in spherical radius
        for (let dx = -data.radius; dx <= data.radius && minedCount < maxBlocksPerTick; dx++) {
            for (let dy = -data.radius; dy <= data.radius && minedCount < maxBlocksPerTick; dy++) {
                for (let dz = -data.radius; dz <= data.radius && minedCount < maxBlocksPerTick; dz++) {
                    // Skip center block (the instant mine block itself)
                    if (dx === 0 && dy === 0 && dz === 0) {
                        continue
                    }

                    // Check if within spherical radius
                    if (dx*dx + dy*dy + dz*dz > data.radius*data.radius) {
                        continue
                    }

                    // Get target block
                    const target = level.getBlock(x + dx, y + dy, z + dz)

                    // Skip air and unbreakable blocks
                    if (target.isAir() || target.id === 'minecraft:bedrock') {
                        continue
                    }

                    // Skip other instant mine blocks
                    if (target.id.startsWith('kubejs:instant_mine_t')) {
                        continue
                    }

                    // Skip blocks that can't be broken
                    // (This is a basic check - you might want to add more)
                    const hardness = target.getProperty('minecraft:block_hardness')
                    if (hardness !== undefined && hardness < 0) {
                        continue  // Unbreakable
                    }

                    // Break the block and drop items
                    try {
                        target.destroy(null, true)  // true = drop items
                        minedCount++

                        // Play subtle sound
                        if (minedCount % 10 === 0) {
                            level.playSound(
                                null,
                                x + dx,
                                y + dy,
                                z + dz,
                                'minecraft:block.break',
                                'minecraft:block',
                                0.3,
                                1.0
                            )
                        }
                    } catch (error) {
                        // Skip blocks that can't be broken
                        console.log('VoidCore: Could not break block: ' + target.id)
                    }
                }
            }
        }

        // Optional: Play mining sound periodically
        if (minedCount > 0) {
            level.playSound(
                null,
                x,
                y,
                z,
                'minecraft:block.amethyst_block.chime',
                'minecraft:block',
                0.5,
                1.0
            )
        }
    })
})

// ============================================
// WORLD LOAD - RESTORE ACTIVE INSTANT MINE BLOCKS
// ============================================

ServerEvents.loaded(event => {
    // Scan loaded chunks for instant mine blocks and reactivate them
    // This ensures blocks remain active after server restart

    const level = event.server.getLevel(0)  // Overworld

    if (!level) {
        return
    }

    // Note: This is a simplified version
    // In practice, you'd want to scan all loaded chunks
    // For now, we'll log that the system is ready
    console.log('VoidCore: Instant mine system loaded!')
    console.log('VoidCore: Place an instant mine block to auto-activate')

    // Clear any stale data
    activeInstantMineBlocks.clear()
})

// ============================================
// DIMENSIONAL TIER SPECIAL BEHAVIOR
// ============================================

// Tier 4 (Dimensional) can mine across unloaded chunks
// This is a very advanced feature that requires chunk loading
// For now, we'll implement a simpler version that mines
// in a very large radius (999 blocks)

// TODO: Implement true dimensional mining for Tier 4
// This would require:
// - Chunk loading tickets
// - Async chunk scanning
// - Better performance optimization

console.log('VoidCore: Instant mine system initialized!')
console.log('VoidCore: Tier 1 (4 blocks), Tier 2 (32 blocks), Tier 3 (96 blocks), Tier 4 (Dimensional)')
