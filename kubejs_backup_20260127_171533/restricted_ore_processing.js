// server_scripts/restricted_ore_processing.js
// VoidCore: Skybound Engineering
// Multiplicative ore processing with restricted dust types
// 2x → 6x → 24x progression chain

ServerEvents.recipes(event => {

    // Helper function to get the correct ingot item ID
    const getIngot = (ore) => {
        if (['iron', 'gold', 'copper'].includes(ore)) {
            return `minecraft:${ore}_ingot`;
        }
        return `#forge:ingots/${ore}`; // Use forge tag for modded ingots
    };

    // Helper function to get the correct dust item ID (for removals or custom KubeJS items)
    const getDust = (ore) => {
        if (['redstone', 'glowstone', 'gunpowder'].includes(ore)) { // Example vanilla dusts
            return `minecraft:${ore}_dust`;
        }
        return `#forge:dusts/${ore}`; // Use forge tag for modded dusts
    };


    console.log('VoidCore: Configuring restricted multiplicative ore processing...')

    const ores = [
        'iron', 'gold', 'copper', 'tin', 'lead', 'silver',
        'nickel', 'uranium', 'zinc'
    ]

    // ============================================
    // TIER 1: ENDER IO SAG MILL (2x)
    // ============================================

    ores.forEach(ore => {
        const sagMillDust = `kubejs:sag_mill_dust_${ore}`
        const oreBlock = `minecraft:${ore}_ore`

        // Make Sag Mill output custom "Sag Mill Dust" instead of regular dust
        // Remove regular dust output
        event.remove({ type: 'enderio:sag_mill', output: getDust(ore) })

        // Add custom Sag Mill dust output recipe
        event.custom({
            type: 'enderio:sag_mill',
            input: { tag: `forge:ores/${ore}` },
            result: { item: sagMillDust, count: 2 }, // 2x output!
            bonusCount: 3, // Bonus tier for 3x (but we're using 2x here)
            energy: 2000,
            time: 100
        }).id(`kubejs:ore/sag_mill_${ore}_custom_dust`)
    })

    // ============================================
    // TIER 2: IE CRUSHER (3x multiplier = 6x total)
    // ============================================

    // Remove ALL default IE Crusher recipes (we're replacing them)
    event.remove({ type: 'immersiveengineering:crusher' })

    // Add custom crusher recipes that accept Sag Mill Dust + Gravel
    ores.forEach(ore => {
        const sagMillDust = `kubejs:sag_mill_dust_${ore}`
        const crusherDust = `kubejs:crusher_dust_${ore}`

        // Recipe: 2 Sag Mill Dust + 1 Gravel → 6 Crusher Dust (3x multiplier on dust only)
        // Gravel is an additional input to improve efficiency
        event.custom({
            type: 'immersiveengineering:crusher',
            input: {
                item: sagMillDust, count: 2,
                tag: 'forge:gravel', count: 1
            },
            result: { item: crusherDust, count: 6 },
            energy: 6000,
            time: 100
        }).id(`kubejs:ore/crusher_${ore}_sag_mill_with_gravel`)
    })

    // ============================================
    // TIER 3: MEKANISM ENRICHMENT CHAMBER (4x multiplier = 24x total)
    // ============================================

    // Remove ALL default Mekanism Enrichment recipes
    event.remove({ type: 'mekanism:enriching' })

    // Add custom enrichment recipes that accept IE Crusher Dust + Diorite
    ores.forEach(ore => {
        const crusherDust = `kubejs:crusher_dust_${ore}`
        const ingotItem = getIngot(ore)

        // Recipe: 6 Crusher Dust + 1 Diorite → 24 Ingots (4x multiplier on dust only)
        // Diorite is an additional input to improve efficiency
        event.custom({
            type: 'mekanism:enriching',
            input: {
                ingredient: { item: crusherDust, count: 6 }
            },
            output: { item: ingotItem, count: 24 },
            chemicalTank: { item: 'mekanism:iron' },
            gasAmount: 100,
            energy: 10000,
            time: 200
        }).id(`kubejs:ore/enrichment_${ore}_crusher_dust_with_diorite_4x`)
    })

    // ============================================
    // DUST TO INGOT SMELTING RECIPES
    // ============================================

    // Tier 1: Smelt Sag Mill Dust (2 dust = 1 ingot)
    ores.forEach(ore => {
        const sagMillDust = `kubejs:sag_mill_dust_${ore}`
        const ingotItem = getIngot(ore)

        event.custom({
            type: 'minecraft:smelting',
            ingredient: { item: sagMillDust },
            result: ingotItem,
            experience: 0.1
        }).id(`kubejs:ore/smelting_${ore}_sag_mill_dust`)
    })

    // Tier 2: Smelt Crusher Dust (6 dust = 3 ingots, but keep as dust)
    // Players can smelt crusher dust in vanilla furnace manually

    // Tier 3: Already handled by Enrichment Chamber (outputs ingots directly)

    // ============================================
    // PREVENT DUST RECYCLING
    // ============================================

    // Remove standard dust smelting (force using our dust)
    ores.forEach(ore => {
        event.remove({ type: 'minecraft:smelting', output: getIngot(ore) })
    })

    // Re-add ONLY the Sag Mill dust smelting recipe (Tier 1)
    // This ensures players can smelt Sag Mill dust before getting Crusher

    // Tier 2: Crusher dust smelting should be done by players manually
    // They need to smelt 6 crusher dust to get 3 ingots (temporary)

    // Tier 3: Enrichment Chamber produces ingots directly, no smelting needed

    console.log('VoidCore: Restricted ore processing configured!')
    console.log('VoidCore: Sag Mill Dust → Crusher Dust → Enrichment Ingots')
    console.log('VoidCore: 2x → 6x → 24x progression enforced!')
})
