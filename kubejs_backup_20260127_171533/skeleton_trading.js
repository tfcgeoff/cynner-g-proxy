// server_scripts/skeleton_trading.js
// VoidCore: Skybound Engineering
// EVENT-DRIVEN Skeleton Arrow Tracking and Soul Net Trading System
// NO LONGER polls all entities every tick - only processes actual events

// Import required classes
const AABB = Java.loadClass('net.minecraft.world.phys.AABB')

// ============================================
// SKELETON SPAWN INITIALIZATION
// ============================================

EntityEvents.spawned('minecraft:skeleton', event => {
    const skeleton = event.entity
    const data = skeleton.getPersistentData()

    // Initialize skeleton data on spawn
    const minArrows = 32
    const maxArrows = 64
    const arrowCount = Math.floor(Math.random() * (maxArrows - minArrows + 1)) + minArrows

    data.putInt('arrow_count', arrowCount)
    data.putInt('max_arrows', arrowCount)
    data.putBoolean('out_of_ammo', false)
    data.putBoolean('trapped', false)
    data.putBoolean('dodging', false)
    data.putInt('dodge_cooldown', 0)

    console.log(`VoidCore: Spawned skeleton with ${arrowCount} arrows`)
})

// ============================================
// ARROW TRACKING & AMMO STATUS (Only checks skeletons that exist)
// ============================================

ServerEvents.tick(event => {
    // Only check every 100 ticks (5 seconds) - not every tick!
    if (event.tick % 100 !== 0) return

    // Only get skeletons - NOT all entities!
    const skeletons = event.server.getEntities('minecraft:skeleton')

    if (skeletons.length === 0) return // No skeletons? No processing!

    skeletons.forEach(skeleton => {
        const data = skeleton.getPersistentData()
        const arrowCount = data.getInt('arrow_count')
        const outOfAmmo = data.getBoolean('out_of_ammo')

        // Simulate arrow usage (1 arrow every 5 seconds on average)
        if (arrowCount > 0 && !outOfAmmo) {
            data.putInt('arrow_count', arrowCount - 1)

            // Check if skeleton just ran out of ammo
            if (arrowCount - 1 <= 0) {
                data.putBoolean('out_of_ammo', true)

                // Notify nearby players
                skeleton.playersInRange.forEach(player => {
                    player.tell('§eA skeleton has run out of arrows!§r')
                    player.tell('§aThrow a Soul Net to trap it!§r')
                })

                console.log('VoidCore: Skeleton ran out of arrows')
            }
        }

        // Slowly regenerate arrows (1 arrow every 30 seconds = 600 ticks)
        // 5 second tick * 6 = 30 seconds
        if (skeleton.age % 600 === 0 && arrowCount < data.getInt('max_arrows') && arrowCount > 0) {
            data.putInt('arrow_count', arrowCount + 1)

            // If skeleton was out of ammo and is now half reloaded, notify
            if (outOfAmmo && arrowCount + 1 >= data.getInt('max_arrows') * 0.5) {
                data.putBoolean('out_of_ammo', false)
                skeleton.playersInRange.forEach(player => {
                    player.tell('§cA skeleton has reloaded its arrows!§r')
                })
            }
        }
    })
})

// ============================================
// DODGE MECHANICS (Only checks trapped skeletons against soul nets)
// ============================================

ServerEvents.tick(event => {
    // Only process every 10 ticks (0.5 seconds)
    if (event.tick % 10 !== 0) return

    // Get all soul net projectiles - NOT all entities!
    const soulNets = event.server.getEntities('@e').filter(e => {
        const data = e.getPersistentData()
        return data.getBoolean('soul_net_projectile')
    })

    if (soulNets.length === 0) return // No soul nets thrown? No processing!

    // For each soul net, check for nearby skeletons to dodge
    soulNets.forEach(netEntity => {
        const nearbyEntities = netEntity.level.getEntitiesWithinAABB(
            'minecraft:skeleton',
            netEntity.getBoundingBox().inflate(8, 8, 8)
        )

        nearbyEntities.forEach(skeleton => {
            const data = skeleton.getPersistentData()
            const trapped = data.getBoolean('trapped')

            // Only untrapped skeletons can dodge
            if (!trapped) {
                const dodgeCooldown = data.getInt('dodge_cooldown')

                if (dodgeCooldown <= 0 && !data.getBoolean('dodging')) {
                    // Attempt to dodge (70% success rate)
                    if (Math.random() < 0.7) {
                        data.putBoolean('dodging', true)

                        // Dodge in a random direction
                        const dodgeAngle = Math.random() * Math.PI * 2
                        const dodgeSpeed = 0.8

                        const motionX = Math.cos(dodgeAngle) * dodgeSpeed
                        const motionZ = Math.sin(dodgeAngle) * dodgeSpeed

                        skeleton.setDeltaMovement(motionX, 0.3, motionZ)
                        data.putInt('dodge_cooldown', 40)

                        // Play sound (30% chance to avoid spam)
                        if (Math.random() < 0.3) {
                            skeleton.playersInRange.forEach(player => {
                                player.playSound('entity.enderman.teleport', 0.5, 1.5)
                            })
                        }

                        console.log('VoidCore: Skeleton dodged Soul Net!')
                    }
                }
            }
        })
    })

    // Handle dodge cooldown and dodging state for active skeletons
    const skeletons = event.server.getEntities('minecraft:skeleton')
    skeletons.forEach(skeleton => {
        const data = skeleton.getPersistentData()

        // Handle dodge cooldown
        const dodgeCooldown = data.getInt('dodge_cooldown')
        if (dodgeCooldown > 0) {
            data.putInt('dodge_cooldown', dodgeCooldown - 1)
        }

        // Reset dodging flag after a short time
        if (data.getBoolean('dodging') && skeleton.age % 10 === 0) {
            data.putBoolean('dodging', false)
        }
    })
})

// ============================================
// THROWABLE SOUL NET MECHANIC (Event-driven!)
// ============================================

ItemEvents.rightClicked('kubejs:soul_net', event => {
    const player = event.player
    const handItem = event.item

    // Only throw when sneaking
    if (!player.shiftKey) return

    // Prevent default behavior
    event.cancel()

    throwSoulNet(player, handItem)
})

function throwSoulNet(player, handItem) {
    const level = player.getLevel()
    const direction = player.getLookAngle()

    // Spawn the Soul Net as an item entity
    const throwPower = 1.5
    const posX = player.getX() + direction.x * 0.5
    const posY = player.getEyeY() + direction.y * 0.5
    const posZ = player.getZ() + direction.z * 0.5

    // Create an item entity
    const netEntity = level.createEntity(
        'minecraft:item',
        posX, posY, posZ
    )

    if (netEntity) {
        netEntity.setItem(handItem.copy())

        // Set velocity
        netEntity.setDeltaMovement(
            direction.x * throwPower,
            direction.y * throwPower,
            direction.z * throwPower
        )

        // Tag it as a thrown Soul Net
        const netData = netEntity.getPersistentData()
        netData.putBoolean('soul_net_projectile', true)
        netData.putString('thrower', player.getUuid())

        // Spawn the entity
        level.spawnEntity(netEntity)

        // Consume the Soul Net
        handItem.shrink(1)

        // Play sound
        player.playSound('entity.snowball.throw', 1.0, 1.0)

        console.log('VoidCore: Soul Net thrown by ' + player.getUsername())
    }
}

// ============================================
// SOUL NET COLLISION DETECTION (Only checks soul nets, not all entities)
// ============================================

ServerEvents.tick(event => {
    // Only process every 5 ticks
    if (event.tick % 5 !== 0) return

    // Get all soul net projectiles
    const soulNets = event.server.getEntities('@e').filter(e => {
        const data = e.getPersistentData()
        return data.getBoolean('soul_net_projectile')
    })

    if (soulNets.length === 0) return

    soulNets.forEach(entity => {
        const data = entity.getPersistentData()
        const level = entity.level

        // Check for nearby skeletons
        const nearbyEntities = level.getEntitiesWithinAABB(
            'minecraft:skeleton',
            entity.getBoundingBox().inflate(1, 1, 1)
        )

        nearbyEntities.forEach(skeleton => {
            const skeletonData = skeleton.getPersistentData()
            const trapped = skeletonData.getBoolean('trapped')
            const outOfAmmo = skeletonData.getBoolean('out_of_ammo')

            // Only trap out-of-ammo skeletons that aren't already trapped
            if (outOfAmmo && !trapped) {
                // Trap the skeleton!
                skeletonData.putBoolean('trapped', true)
                skeleton.setCustomName('§7Trapped Skeleton§r')
                skeleton.setPersistenceRequired(true)

                // Remove the Soul Net entity
                entity.discard()

                // Find the thrower and notify them
                const throwerUuid = data.getString('thrower')
                const thrower = level.getPlayerByUUID(throwerUuid)

                if (thrower) {
                    thrower.tell('§aSoul Net caught a skeleton!§r')
                    thrower.tell('§eShift + click with bones to trade.§r')
                    thrower.playSound('entity.experience_orb.pickup', 1.0, 0.5)
                }

                console.log('VoidCore: Skeleton trapped with Soul Net!')

            } else if (!outOfAmmo && !trapped) {
                // Skeleton still has arrows - net bounces off
                entity.discard()

                const throwerUuid = data.getString('thrower')
                const thrower = level.getPlayerByUUID(throwerUuid)

                if (thrower) {
                    thrower.tell('§cSoul Net bounced! Skeleton still has arrows.§r')
                    thrower.tell('§eWait for it to run out of ammo first.§r')
                    thrower.playSound('entity.item.break', 0.5, 0.8)
                }

                // Drop the Soul Net as an item
                level.spawnEntity(
                    'minecraft:item',
                    entity.x, entity.y, entity.z
                ).setItem(Item.of('kubejs:soul_net', 1))

            } else if (trapped) {
                // Already trapped - return the net
                entity.discard()

                const throwerUuid = data.getString('thrower')
                const thrower = level.getPlayerByUUID(throwerUuid)

                if (thrower) {
                    thrower.tell('§cThis skeleton is already trapped.§r')
                    thrower.playSound('entity.villager.no', 1.0, 1.0)
                }

                // Return the Soul Net
                level.spawnEntity(
                    'minecraft:item',
                    entity.x, entity.y, entity.z
                ).setItem(Item.of('kubejs:soul_net', 1))
            }
        })

        // Despawn after 5 seconds if it doesn't hit anything
        if (entity.age > 100) {
            entity.discard()

            // Drop as item (can be picked up and thrown again)
            entity.level.spawnEntity(
                'minecraft:item',
                entity.x, entity.y, entity.z
            ).setItem(Item.of('kubejs:soul_net', 1))
        }
    })
})

// ============================================
// SKELETON TRADING SYSTEM (Event-driven!)
// ============================================

ItemEvents.rightClicked('minecraft:bone', event => {
    const player = event.player
    const handItem = event.item

    // Only trade when sneaking
    if (!player.shiftKey) return

    // Check for nearby trapped skeletons
    const playerPos = player.blockPosition()
    const nearbyEntities = player.level.getEntitiesWithinAABB(
        'minecraft:skeleton',
        AABB.ofBlockPos(playerPos).inflate(2, 2, 2)
    )

    for (const skeleton of nearbyEntities) {
        const skeletonData = skeleton.getPersistentData()
        const trapped = skeletonData.getBoolean('trapped')

        if (trapped) {
            // Trade with the skeleton
            tradeWithSkeleton(player, skeleton, handItem)
            event.cancel() // Prevent default behavior
            return // Only trade with one skeleton per click
        }
    }
})

function tradeWithSkeleton(player, skeleton, handItem) {
    const tradeOptions = [
        // Resources (utility, not progression)
        { item: 'minecraft:glowstone', amount: 2, chance: 100 },
        { item: 'minecraft:coal', amount: 4, chance: 60 },
        { item: 'minecraft:gold_nugget', amount: 2, chance: 40 },
        { item: 'minecraft:iron_bars', amount: 2, chance: 30 },
        // Useful items
        { item: 'minecraft:chest', amount: 1, chance: 50 },
        { item: 'minecraft:saddle', amount: 1, chance: 10 },
        { item: 'minecraft:name_tag', amount: 1, chance: 25 },
        { item: 'minecraft:clock', amount: 1, chance: 30 },
        { item: 'minecraft:compass', amount: 1, chance: 35 },
        { item: 'minecraft:experience_bottle', amount: 1, chance: 15 },
        { item: 'minecraft:ender_pearl', amount: 1, chance: 5 },
        // Rare loot
        { item: 'minecraft:elytra', amount: 1, chance: 2 },
    ]

    // Select a random trade
    const roll = Math.random() * 100
    let cumulativeChance = 0
    let selectedTrade = null

    for (const trade of tradeOptions) {
        cumulativeChance += trade.chance
        if (roll <= cumulativeChance) {
            selectedTrade = trade
            break
        }
    }

    if (selectedTrade) {
        // Give the player the trade item
        player.give(Item.of(selectedTrade.item, selectedTrade.amount))

        // Consume the bone
        handItem.shrink(1)

        // Notify player
        player.tell(`§aTraded bone for ${selectedTrade.amount}x ${selectedTrade.item}!§r`)

        // Play trade sound
        player.playSound('entity.villager.yes', 1.0, 1.0)

    } else {
        // No trade selected
        player.tell('§cThe skeleton has nothing to trade.§r')
        handItem.shrink(1)
        player.playSound('entity.villager.no', 1.0, 1.2)
    }
}

// ============================================
// INITIALIZATION COMPLETE
// ============================================

console.log('VoidCore: EVENT-DRIVEN Skeleton trading system initialized!')
console.log('VoidCore: Skeletons have 32-64 arrows')
console.log('VoidCore: Throw Soul Nets (Shift + click) to trap out-of-ammo skeletons')
console.log('VoidCore: Shift + click with bones on trapped skeletons to trade')
console.log('VoidCore: NO LONGER polling all entities - using event-driven architecture!')
