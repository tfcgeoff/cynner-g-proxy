// server_scripts/bioluminescent_recipes.js
// VoidCore: Skybound Engineering
// Bioluminescent Lighting System

ServerEvents.recipes(event => {

    console.log('VoidCore: Setting up bioluminescent lighting system...')

    // ============================================
    // REMOVE VANILLA GLOWSTONE RECIPES
    // ============================================

    // Remove vanilla glowstone crafting
    event.remove({ output: 'minecraft:glowstone' })

    // Remove glowstone dust from blasting/smeltng
    event.remove({ type: 'minecraft:smelting', output: 'minecraft:glowstone_dust' })
    event.remove({ type: 'minecraft:blasting', output: 'minecraft:glowstone_dust' })

    // ============================================
    // BIOLUMINESCENT DUST CRAFTING
    // ============================================

    // Create bioluminescent dust from redstone + organic material
    event.shapeless('kubejs:glowstone_dust', 4, [
        '#forge:dusts/redstone',
        '#forge:dusts/redstone',
        '#forge:dusts/redstone',
        '#forge:dusts/redstone',
        '#forge:slimeballs',
        'minecraft:sugar'
    ]).id('kubejs:bioluminescent_dust_crafting')

    // ============================================
    // BIOLUMINESCENT GEL CRAFTING
    // ============================================

    // Convert 4 dust into 1 gel (solid form)
    event.shapeless('kubejs:bioluminescent_gel', 1, [
        'kubejs:glowstone_dust',
        'kubejs:glowstone_dust',
        'kubejs:glowstone_dust',
        'kubejs:glowstone_dust',
        'minecraft:slime_ball'
    ]).id('kubejs:bioluminescent_gel_from_dust')

    // ============================================
    // GLOWSTONE BLOCK CRAFTING
    // ============================================

    // Convert gel back to glowstone block (for compatibility)
    event.shapeless('minecraft:glowstone', 1, [
        'kubejs:bioluminescent_gel'
    ]).id('kubejs:glowstone_from_bioluminescent_gel')

    // Convert 4 dust into glowstone block directly
    event.shaped('minecraft:glowstone', 1, [
        'DD',
        'DD'
    ], {
        D: 'kubejs:glowstone_dust'
    }).id('kubejs:glowstone_from_dust')

    // Convert glowstone block back to dust
    event.shapeless('kubejs:glowstone_dust', 4, [
        'minecraft:glowstone'
    ]).id('kubejs:dust_from_glowstone')

    // ============================================
    // TINKERS SMELTERY - BIOLUMINESCENT GOO
    // ============================================

    // Melt biomass into bioluminescent goo
    event.custom({
        type: 'tconstruct:melting',
        ingredient: { tag: 'forge:biomass' },
        result: { fluid: 'kubejs:bioluminescent_flux', amount: 250 },
        temperature: 300,
        time: 20
    }).id('kubejs:melting/biomass_to_bioluminescent_flux')

    // Melt slimeballs + redstone into bioluminescent goo
    event.custom({
        type: 'tconstruct:melting',
        ingredient: [
            { tag: 'forge:slimeballs', count: 1 },
            { tag: 'forge:dusts/redstone', count: 4 }
        ],
        result: { fluid: 'kubejs:bioluminescent_flux', amount: 500 },
        temperature: 300,
        time: 30
    }).id('kubejs:melting/slime_redstone_to_goo')

    // ============================================
    // TINKERS CASTING TABLE - BIOLUMINESCENT ITEMS
    // ============================================

    // Cast bioluminescent goo into glowstone dust
    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'forge:empty_cast' },
        fluid: { fluid: 'kubejs:bioluminescent_flux', amount: 125 },
        result: 'kubejs:glowstone_dust',
        coolingTime: 20
    }).id('kubejs:casting/goo_to_dust')

    // Cast bioluminescent goo into bioluminescent gel
    event.custom({
        type: 'tconstruct:casting_table',
        cast: { tag: 'forge:empty_cast' },
        fluid: { fluid: 'kubejs:bioluminescent_flux', amount: 500 },
        result: 'kubejs:bioluminescent_gel',
        coolingTime: 40
    }).id('kubejs:casting/goo_to_gel')

    // Cast bioluminescent goo into glowstone block
    event.custom({
        type: 'tconstruct:casting_basin',
        fluid: { fluid: 'kubejs:bioluminescent_flux', amount: 500 },
        result: 'minecraft:glowstone',
        coolingTime: 40
    }).id('kubejs:casting_basin/goo_to_glowstone')

    // ============================================
    // THERMAL CENTRIFUGE - BIOLUMINESCENT PROCESSING
    // ============================================

    // Process biomass in centrifuge to produce bioluminescent goo bucket
    event.custom({
        type: 'thermal:centrifuge',
        ingredient: { tag: 'forge:biomass' },
        result: [
            { fluid: 'kubejs:bioluminescent_flux', amount: 250 },
            { item: 'minecraft:charcoal', chance: 0.1 }
        ],
        energy: 2000
    }).id('kubejs:centrifuge/biomass_to_goo')

    // ============================================
    // MEKANISM BIO-REACTION
    // ============================================

    // Bio-reaction to produce bioluminescent goo
    event.custom({
        type: 'mekanism:reaction',
        itemInput: { amount: 1, ingredient: { tag: 'forge:slimeballs' } },
        fluidInput: { amount: 500, tag: 'forge:redstone' },
        gasInput: { amount: 1, gas: 'mekanism:ethene' },
        output: { fluid: 'kubejs:bioluminescent_flux', amount: 500 },
        energyMultiplier: 1.0,
        duration: 100
    }).id('kubejs:reaction/bioluminescent_flux')

    console.log('VoidCore: Bioluminescent lighting recipes configured!')

})
