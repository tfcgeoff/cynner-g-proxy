// server_scripts/cross_mod_recipes.js
// VoidCore: Skybound Engineering
// Cross-mod recipe integration - forces interconnectedness

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


    console.log('VoidCore: Adding cross-mod recipes...')

    // ============================================
    // ENERGY STORAGE - PROGRESSIVE TIERS
    // ============================================

    // Tier 1: Mekanism Basic Energy Cube (unchanged, early game)
    // Already available in vanilla Mekanism

    // Tier 2: IE HV Acid Battery (requires Mek Basic Cube)
    event.remove({ output: 'immersiveengineering:heavy_engineering' }) // Remove base recipe if needed
    event.shaped('immersiveengineering:heavy_engineering', [
        'IEI',
        'ECE',
        ' I '
    ], {
        I: 'minecraft:iron_ingot',
        E: 'immersiveengineering:electron_tube',
        C: 'mekanism:basic_energy_cube', // Requires Mek energy cube!
        H: 'immersiveengineering:hammer'
    }).id('kubejs:cross/hv_battery_with_mek_cube')

    // Tier 3: Ender IO Octadic Capacitor (requires IE HV Battery + Signalum + Vibrant)
    event.remove({ output: 'enderio:octadic_capacitor' })
    event.shaped('enderio:octadic_capacitor', [
        'VSE',
        'SCS',
        'CV '
    ], {
        V: 'enderio:vibrant_alloy', // From Ender IO
        S: 'thermal:signalum_ingot',
        C: 'immersiveengineering:capacitor_hv',
        E: 'enderio:energetic_alloy'
    }).id('kubejs:cross/octadic_with_ie_battery')

    // ============================================
    // NOTE: Ore processing machines are gated in dedicated files:
    // - multiplicative_ore_processing.js (recipe setup and processing)
    // - restricted_ore_processing_gating.js (machine gating)
    // ============================================

    // ============================================
    // METAL WORKING - ENDER IO POWERED FURNACE
    // ============================================

    // Ender IO Powered Furnace (requires IE Steel + Ender IO Cap + Mek Circuit)
    event.remove({ output: 'enderio:powered_furnace' })
    event.shaped('enderio:powered_furnace', [
        'SFS',
        'FPC',
        'S S'
    ], {
        S: 'immersiveengineering:ingot_steel', // From Tinkers Smeltery!
        F: 'minecraft:furnace',
        P: 'enderio:powered_spawner', // Temporary placeholder
        C: 'mekanism:basic_circuit',
        space: 'enderio:basic_capacitor'
    }).id('kubejs:cross/powered_furnace_gated')

    // ============================================
    // STORAGE - HYBRID SYSTEM
    // ============================================

    // Refined Storage Controller (requires Ender IO Cap + IE Cable + Mek Circuit)
    event.remove({ output: 'refinedstorage:controller' })
    event.shaped('refinedstorage:controller', [
        'ECI',
        'CRC',
        ' E '
    ], {
        E: 'enderio:basic_capacitor',
        C: 'mekanism:basic_circuit',
        I: 'immersiveengineering:wire_lead', // IE Cable
        R: 'refinedstorage:upgrade_base', // Base from RS
        space: 'refinedstorage:quartz_enriched_iron'
    }).id('kubejs:cross/rs_controller_gated')

    // AE2 Crafter (requires RS Upgrade + Mekanism Steel + Ender IO Vibrant)
    event.remove({ output: 'ae2:crafting_monitor' })
    event.shaped('ae2:crafting_monitor', [
        'VAV',
        'MCM',
        'VE '
    ], {
        V: 'enderio:vibrant_alloy', // From Ender IO
        A: 'ae2:calculation_processor',
        M: 'mekanism:basic_machine',
        C: 'refinedstorage:upgrade_crafting', // RS Upgrade!
        E: 'enderio:energetic_alloy'
    }).id('kubejs:cross/ae2_crafter_gated')

    // Tom's Storage Cable (connects AE2 to RS)
    event.shaped('toms_storage:storage_cable', [
        'CIC',
        ' I ',
        'C C'
    ], {
        C: 'immersiveengineering:wire_copper',
        I: 'enderio:item_conduit',
        space: 'minecraft:redstone'
    }).id('kubejs:cross/toms_cable_gated')

    // ============================================
    // TOOLS - PROGRESSIVE GATING
    // ============================================

    // Custom: Refined Storage Upgrade Chip (new item required for diamond tools)
    // Simplified recipe to avoid circular dependency with RS Controller
    event.shaped('kubejs:rs_upgrade_chip', [
        'QRQ',
        'RCR',
        'QRQ'
    ], {
        Q: 'refinedstorage:quartz_enriched_iron',
        R: 'minecraft:redstone',
        C: 'thermal:redstone_servo', // Early-game Thermal component
        E: 'enderio:energetic_alloy'
    }).id('kubejs:cross/rs_upgrade_chip')

    // Diamond Pickaxe (Iron Tool + RS Chip + IE Steel)
    event.remove({ output: 'minecraft:diamond_pickaxe' })
    event.shaped('minecraft:diamond_pickaxe', [
        'DDD',
        'IXS',
        ' X '
    ], {
        D: 'minecraft:diamond',
        I: 'minecraft:iron_pickaxe', // Sacrifice iron tool!
        X: 'kubejs:rs_upgrade_chip', // RS Chip!
        S: 'immersiveengineering:ingot_steel' // IE Steel
    }).id('kubejs:cross/diamond_pickaxe_gated')

    // Diamond Axe (Iron Tool + RS Chip + IE Steel)
    event.remove({ output: 'minecraft:diamond_axe' })
    event.shaped('minecraft:diamond_axe', [
        'DDS',
        'DXI',
        ' X '
    ], {
        D: 'minecraft:diamond',
        X: 'kubejs:rs_upgrade_chip',
        I: 'minecraft:iron_axe',
        S: 'immersiveengineering:ingot_steel'
    }).id('kubejs:cross/diamond_axe_gated')

    // Diamond Sword (Iron Tool + RS Chip + IE Steel + Mek Alloy)
    event.remove({ output: 'minecraft:diamond_sword' })
    event.shaped('minecraft:diamond_sword', [
        ' D ',
        ' D ',
        'XIS'
    ], {
        D: 'minecraft:diamond',
        X: 'kubejs:rs_upgrade_chip',
        I: 'minecraft:iron_sword',
        S: 'immersiveengineering:ingot_steel'
    }).id('kubejs:cross/diamond_sword_gated')

    // ============================================
    // NETHERITE TOOLS - ENDGAME GATING
    // ============================================

    // Netherite Core (intermediate crafting component)
    event.shaped('kubejs:netherite_core', [
        'NIN',
        'IEI',
        'NIN'
    ], {
        N: 'minecraft:netherite_ingot',
        I: 'minecraft:diamond',
        E: 'enderio:octadic_capacitor'
    }).id('kubejs:cross/netherite_core')

    // Netherite Pickaxe (Diamond Tool sacrifice + Octadic Capacitor + Creative Core)
    event.remove({ output: 'minecraft:netherite_pickaxe' })
    event.shaped('minecraft:netherite_pickaxe', [
        'NDN',
        'IXS',
        ' X '
    ], {
        N: 'minecraft:netherite_ingot',
        D: 'minecraft:diamond_pickaxe', // Sacrifice diamond tool
        I: 'kubejs:creative_core', // Endgame component
        X: 'enderio:octadic_capacitor', // Endgame capacitor
        S: 'thermal:enderium_ingot' // Thermal endgame
    }).id('kubejs:cross/netherite_pickaxe_gated')

    // Netherite Axe (Diamond Tool sacrifice + Octadic Capacitor + Creative Core)
    event.remove({ output: 'minecraft:netherite_axe' })
    event.shaped('minecraft:netherite_axe', [
        'NDS',
        'DXI',
        ' X '
    ], {
        N: 'minecraft:netherite_ingot',
        D: 'minecraft:diamond_axe', // Sacrifice diamond tool
        X: 'kubejs:creative_core',
        I: 'enderio:octadic_capacitor',
        S: 'thermal:enderium_ingot'
    }).id('kubejs:cross/netherite_axe_gated')

    // Netherite Sword (Diamond Tool sacrifice + Octadic Capacitor + Creative Core)
    event.remove({ output: 'minecraft:netherite_sword' })
    event.shaped('minecraft:netherite_sword', [
        ' N ',
        ' N ',
        'XIS'
    ], {
        N: 'minecraft:netherite_ingot',
        X: 'kubejs:creative_core',
        I: 'minecraft:diamond_sword', // Sacrifice diamond sword
        S: 'thermal:enderium_ingot'
    }).id('kubejs:cross/netherite_sword_gated')

    console.log('VoidCore: Netherite tools gated with endgame components!')

    // ============================================
    // BACKPACK - COMBINED SYSTEM
    // ============================================

    // Base: Iron Backpack
    // Iron Backpacks recipe is fine, no changes needed

    // Sophisticated Upgrade (applies to Iron Backpack)
    event.shaped('kubejs:backpack_sophisticated', [
        'BI ',
        'BP ',
        '   '
    ], {
        B: 'ironbackpacks:backpack',
        I: 'sophisticatedbackpacks:upgrade_base',
        P: 'ironbackpacks:backpack'
    }).id('kubejs:cross/backpack_sophisticated_upgrade')

    // Inventory Essentials Jetpack Module (applies to Sophisticated Backpack)
    event.shaped('kubejs:backpack_jetpack', [
        ' F ',
        'BJB',
        ' F '
    ], {
        F: 'inventoryessential:jetpack',
        B: 'kubejs:backpack_sophisticated', // Requires upgraded backpack!
        J: 'inventoryessential:jetpack_upgrade'
    }).id('kubejs:cross/backpack_jetpack_upgrade')

    // ============================================
    // FARMING - IE SAWMILL BONUS
    // ============================================

    // IE Sawmill (recipe unchanged)
    // But configure it to give 5 planks per log instead of 4
    // This is a config setting in IE, not a recipe change

    // ============================================
    // BONUS: CROSS-MOD RECIPES FOR KEY ITEMS
    // ============================================

    // Mekanism Basic Circuit (requires Ender IO capacitor)
    event.remove({ output: 'mekanism:basic_circuit' })
    event.shaped('mekanism:basic_circuit', [
        'RGR',
        'CEC',
        'RGR'
    ], {
        R: 'minecraft:redstone',
        G: 'minecraft:glowstone_dust',
        C: 'enderio:basic_capacitor' // Requires Ender IO!
    }).id('kubejs:cross/mek_basic_circuit_gated')

    // Ender IO Basic Capacitor (requires Mekanism circuit)
    event.remove({ output: 'enderio:basic_capacitor' })
    event.shaped('enderio:basic_capacitor', [
        'EIE',
        'ICI',
        'EIE'
    ], {
        E: 'enderio:basic_capacitor',
        I: 'minecraft:iron_ingot',
        C: 'mekanism:basic_circuit' // Requires Mekanism!
    }).id('kubejs:cross/enderio_capacitor_gated')

    // This creates a circular dependency!
    // We need to break it by making ONE of them available without the other
    // Let's make a "starter capacitor" and "starter circuit" recipe

    // Starter Capacitor (early game, no requirements)
    event.shaped('kubejs:starter_capacitor', [
        'III',
        'IRI',
        'III'
    ], {
        I: 'minecraft:iron_ingot',
        R: 'minecraft:redstone'
    }).id('kubejs:starter_capacitor')

    // Starter Circuit (early game, no requirements)
    event.shaped('kubejs:starter_circuit', [
        'RGR',
        'CCC',
        'RGR'
    ], {
        R: 'minecraft:redstone',
        G: 'minecraft:glowstone_dust',
        C: 'minecraft:copper_ingot'
    }).id('kubejs:starter_circuit')

    // Now the real recipes require the starter versions
    event.remove({ output: 'mekanism:basic_circuit' })
    event.shaped('mekanism:basic_circuit', [
        'RGR',
        'CKC',
        'RGR'
    ], {
        R: 'minecraft:redstone',
        G: 'minecraft:glowstone_dust',
        C: 'kubejs:starter_capacitor' // Requires starter cap!
    }).id('kubejs:cross/mek_basic_circuit_with_starter_cap')

    event.remove({ output: 'enderio:basic_capacitor' })
    event.shaped('enderio:basic_capacitor', [
        'III',
        'ICI',
        'III'
    ], {
        I: 'minecraft:iron_ingot',
        C: 'kubejs:starter_circuit' // Requires starter circuit!
    }).id('kubejs:cross/enderio_capacitor_with_starter_circuit')

    console.log('VoidCore: Cross-mod recipes added!')
    console.log('VoidCore: All mods now interconnected!')
})
