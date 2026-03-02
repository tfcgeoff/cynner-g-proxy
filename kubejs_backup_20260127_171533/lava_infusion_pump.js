// server_scripts/lava_infusion_pump.js
// VoidCore: Skybound Engineering
// Lava Infusion Pump - Infinite lava from large lava lakes

BlockEvents.rightClicked('kubejs:lava_infusion_pump', event => {
    const { block, player, server, level } = event

    // Find adjacent Ender Tank
    const pos = block.pos
    const directions = [
        { x: 1, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: -1, z: 0 },
        { x: 0, y: 0, z: 1 },
        { x: 0, y: 0, z: -1 }
    ]

    let enderTank = null
    for (const dir of directions) {
        const checkPos = pos.offset(dir.x, dir.y, dir.z)
        const checkBlock = level.getBlock(checkPos)
        if (checkBlock.id === 'enderstorage:ender_tank') {
            enderTank = checkBlock
            break
        }
    }

    if (!enderTank) {
        player.statusMessage = '§cNo Ender Tank adjacent! Place an Ender Tank next to the pump.'
        return
    }

    player.statusMessage = '§eScanning for lava...'

    // Schedule the lava check in the next server tick (avoid blocking)
    server.scheduleInTicks(20, () => {
        const lavaCount = countLavaBlocks(level, pos, 50)

        if (lavaCount < 10000) {
            player.statusMessage = `§cInsufficient lava! Found ${lavaCount} blocks, need 10,000.`
            return
        }

        // Success! Fill the Ender Tank
        player.statusMessage = `§aLava reservoir found! (${lavaCount} blocks) Activating infusion...`

        // Set Ender Tank fluid to lava (full)
        const tankData = enderTank.getTileEntity()
        if (tankData) {
            // Ender Tanks store fluid data - fill with infinite lava
            tankData.primFluid = 'minecraft:lava'
            // The tank is now a lava source that never runs dry
            enderTank.mergeEntityData({ fluid: { FluidName: 'minecraft:lava', Amount: 1000000000 } })
        }

        player.tell([
            '§c§lLAVA INFUSION COMPLETE!',
            '',
            '§7Your Ender Tank is now linked to the lava reservoir.',
            '§7It will provide infinite lava from this dimension.',
            `§7Reservoir size: §e${lavaCount}§7 lava blocks.`
        ])
    })
})

// Count contiguous lava blocks in a radius using flood fill
function countLavaBlocks(level, centerPos, radius) {
    const visited = new Set()
    const queue = []
    let count = 0
    const maxCount = 15000 // Stop counting after this to prevent lag

    // Start from center and expand outward
    for (let y = -radius; y <= radius; y += 5) {
        for (let x = -radius; x <= radius; x += 5) {
            for (let z = -radius; z <= radius; z += 5) {
                const checkPos = centerPos.offset(x, y, z)
                const block = level.getBlock(checkPos)
                if (block.id === 'minecraft:lava' || block.id === 'minecraft:flowing_lava') {
                    const key = `${checkPos.x},${checkPos.y},${checkPos.z}`
                    if (!visited.has(key)) {
                        visited.add(key)
                        queue.push(checkPos)
                        count++
                    }
                }
            }
        }
    }

    // Flood fill from discovered lava sources
    while (queue.length > 0 && count < maxCount) {
        const current = queue.shift()

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dz = -1; dz <= 1; dz++) {
                    if (dx === 0 && dy === 0 && dz === 0) continue

                    const neighbor = current.offset(dx, dy, dz)
                    const key = `${neighbor.x},${neighbor.y},${neighbor.z}`

                    if (visited.has(key)) continue

                    const block = level.getBlock(neighbor)
                    if (block.id === 'minecraft:lava' || block.id === 'minecraft:flowing_lava') {
                        visited.add(key)
                        queue.push(neighbor)
                        count++
                    }
                }
            }
        }
    }

    return count
}

console.log('VoidCore: Lava Infusion Pump system loaded!')
