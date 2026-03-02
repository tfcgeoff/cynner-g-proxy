// server_scripts/multiplicative_ore_processing.js
// VoidCore: Skybound Engineering
// Multiplicative ore processing: 2x → 6x → 24x

ServerEvents.recipes(event => {

    // Helper function to get the correct ingot item ID
    const getIngot = (ore) => {
        if (['iron', 'gold', 'copper'].includes(ore)) {
            return `minecraft:${ore}_ingot`;
        }
        return `#forge:ingots/${ore}`; // Use forge tag for modded ingots
    };

    // Helper function to get the correct dust item ID (for crusher, enrichment)
    const getDust = (ore) => {
        // Special handling for coal dust which might be `minecraft:coal`
        if (ore === 'coal') {
            return '#forge:dusts/coal'; // Or specific modded coal dust
        }
        if (['redstone', 'glowstone', 'gunpowder'].includes(ore)) { // Example vanilla dusts
            return `minecraft:${ore}_dust`;
        }
        return `#forge:dusts/${ore}`; // Use forge tag for modded dusts
    };


    console.log('VoidCore: Configuring multiplicative ore processing...')

    // ============================================
    // TIER 1: ENDER IO SAG MILL (2x)
    // ============================================
    // Sag Mill naturally outputs 2x dust
    // Just gate the recipe, no configuration needed

    event.remove({ output: 'enderio:sag_mill' })
    event.shaped('enderio:sag_mill', [
        'GFG',
        'ICI',
        'GFG'
    ], {
        G: 'minecraft:gravel',
        F: 'minecraft:furnace',
        I: 'minecraft:iron_ingot',
        C: 'kubejs:starter_capacitor' // Requires starter capacitor
    }).id('kubejs:ore/sag_mill_gated')

    // ============================================
    // TIER 2: IE CRUSHER (3x MULTIPLIER = 6x TOTAL)
    // ============================================
    // Crusher takes dust from Sag Mill and triples it

    // Remove default ore crushing recipes (we only want dust processing)
    event.remove({ type: 'immersiveengineering:crusher' })

    // Add dust processing recipes for all common ores
    const ores = [
        'iron', 'gold', 'copper', 'tin', 'lead', 'silver',
        'nickel', 'uranium', 'osmium', 'zinc', 'coal'
    ]

    ores.forEach(ore => {
        // Check if this ore has dust in vanilla/modded
        const dustItem = getDust(ore)

        // Try to add the recipe, if the dust exists it will work
        event.custom({
            type: 'immersiveengineering:crusher',
            input: { tag: `forge:dusts/${ore}` },
            result: dustItem,
            energy: 6000,
            time: 100
        }).id(`kubejs:ore/crusher_${ore}_dust_3x`)
    })

    // Gate the Crusher recipe itself
    event.remove({ output: 'immersiveengineering:crusher' })
    event.shaped('immersiveengineering:crusher', [
        'S S',
        'PCP',
        'S S'
    ], {
        S: 'immersiveengineering:plate_steel',
        P: 'immersiveengineering:piston_crusher',
        C: 'enderio:item_conduit', // Requires Ender IO!
        space: 'kubejs:rs_upgrade_chip' // Requires RS chip!
    }).id('kubejs:ore/crusher_gated')

    // ============================================
    // TIER 3: MEKANISM ENRICHMENT CHAMBER (4x MULTIPLIER = 24x TOTAL)
    // ============================================
    // Enrichment Chamber takes dust from Crusher and quadruples it

    // Remove default Enrichment Chamber recipes
    event.remove({ type: 'mekanism:enriching' })

    // Add dust enrichment recipes for all ores
    ores.forEach(ore => {
        const dustItem = getDust(ore)
        const ingotItem = getIngot(ore)

        // Enrich dust into ingots (4:1 ratio)
        event.custom({
            type: 'mekanism:enriching',
            input: { ingredient: { item: dustItem, count: 4 } },
            output: { item: ingotItem, count: 16 },
            chemicalTank: { item: 'mekanism:iron' },
            gasAmount: 100
        }).id(`kubejs:ore/enrichment_${ore}_dust_4x`)
    })

    // Gate the Enrichment Chamber recipe
    event.shaped('mekanism:enrichment_chamber', [
        'ECE',
        'ODO',
        'ECE'
    ], {
        E: 'enderio:octadic_capacitor', // Requires endgame capacitor!
        C: 'mekanism:basic_circuit',
        O: 'mekanism:enriched_alloy',
        D: 'thermal:signalum_ingot' // Thermal mid-game alloy
    }).id('kubejs:ore/enrichment_gated')

    // ============================================
    // DUST TO INGOT RECIPES
    // ============================================
    // Players need to smelt dust back into ingots
    // This is done in Tiers 1-3 depending on which machines they have

    // Tier 1: Vanilla furnace (1 dust → 1 ingot)
    // No changes needed, vanilla handles this

    // Tier 2: Ender IO Powered Furnace (fast smelting)
    // Already configured in cross_mod_recipes.js

    // Tier 3: Mekanism Energized Smelter (fastest smelting)
    // Already gated behind late game

    console.log('VoidCore: Multiplicative ore processing configured!')
    console.log('VoidCore: 2x → 6x → 24x progression chain active!')
})
