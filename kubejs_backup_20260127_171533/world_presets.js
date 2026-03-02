// Force only normal world preset (skyblock void)
// Force only normal world preset (skyblock void)
ServerEvents.highPriorityData(event => {
    // Add the custom 'minecraft:void' noise setting
    event.addJson('minecraft:worldgen/noise_settings/void.json', {
        "sea_level": 0,
        "disable_mob_generation": false,
        "aquifers_enabled": false,
        "ore_veins_enabled": false,
        "legacy_random_source": false,
        "default_block": { "Name": "minecraft:air" },
        "default_fluid": { "Name": "minecraft:air" },
        "noise": {
            "min_y": -64,
            "height": 384,
            "size_horizontal": 1,
            "size_vertical": 2
        },
        "noise_router": {
            "barrier": 0.0, "fluid_level_floodedness": 0.0, "fluid_level_spread": 0.0, "lava": 0.0, "vein_toggle": 0.0, "vein_ridged": 0.0, "vein_gap": 0.0, "temperature": 0.0, "vegetation": 0.0, "continents": 0.0, "erosion": 0.0, "depth": 0.0, "ridges": 0.0, "initial_density_without_jaggedness": -1.0, "final_density": -1.0
        },
        "terrain_shaper": {
            "offset": 0.0,
            "factor": 0.0,
            "jaggedness": 0.0
        },
        "surface_rule": {
            "type": "minecraft:block",
            "result_state": {
                "Name": "minecraft:air"
            }
        },
        "spawn_target": []
    });

    // Override other presets to make them void or non-functional

    // Make flat world generate as void
    event.addJson('minecraft:worldgen/world_preset/flat.json', {
        "dimensions": {
            "minecraft:overworld": {
                "type": "minecraft:overworld",
                "generator": {
                    "type": "minecraft:noise",
                    "settings": "minecraft:void",
                    "biome_source": {
                        "type": "minecraft:multi_noise",
                        "preset": "minecraft:overworld"
                    }
                }
            }
        }
    });

    // Make large_biomes generate as void
    event.addJson('minecraft:worldgen/world_preset/large_biomes.json', {
        "dimensions": {
            "minecraft:overworld": {
                "type": "minecraft:overworld",
                "generator": {
                    "type": "minecraft:noise",
                    "settings": "minecraft:void",
                    "biome_source": {
                        "type": "minecraft:multi_noise",
                        "preset": "minecraft:overworld"
                    }
                }
            }
        }
    });

    // Make amplified world generate as void
    event.addJson('minecraft:worldgen/world_preset/amplified.json', {
        "dimensions": {
            "minecraft:overworld": {
                "type": "minecraft:overworld",
                "generator": {
                    "type": "minecraft:noise",
                    "settings": "minecraft:void",
                    "biome_source": {
                        "type": "minecraft:multi_noise",
                        "preset": "minecraft:overworld"
                    }
                }
            }
        }
    });

    // Make single_biome_surface generate as void
    event.addJson('minecraft:worldgen/world_preset/single_biome_surface.json', {
        "dimensions": {
            "minecraft:overworld": {
                "type": "minecraft:overworld",
                "generator": {
                    "type": "minecraft:noise",
                    "settings": "minecraft:void",
                    "biome_source": {
                        "type": "minecraft:multi_noise",
                        "preset": "minecraft:overworld"
                    }
                }
            }
        }
    });

    // Make single_biome_caves generate as void
    event.addJson('minecraft:worldgen/world_preset/single_biome_caves.json', {
        "dimensions": {
            "minecraft:overworld": {
                "type": "minecraft:overworld",
                "generator": {
                    "type": "minecraft:noise",
                    "settings": "minecraft:void",
                    "biome_source": {
                        "type": "minecraft:multi_noise",
                        "preset": "minecraft:overworld"
                    }
                }
            }
        }
    });

    // Make single_biome_floating_islands generate as void
    event.addJson('minecraft:worldgen/world_preset/single_biome_floating_islands.json', {
        "dimensions": {
            "minecraft:overworld": {
                "type": "minecraft:overworld",
                "generator": {
                    "type": "minecraft:noise",
                    "settings": "minecraft:void",
                    "biome_source": {
                        "type": "minecraft:multi_noise",
                        "preset": "minecraft:overworld"
                    }
                }
            }
        }
    });

    // Make debug_all_block_states generate as void
    event.addJson('minecraft:worldgen/world_preset/debug_all_block_states.json', {
        "dimensions": {
            "minecraft:overworld": {
                "type": "minecraft:overworld",
                "generator": {
                    "type": "minecraft:noise",
                    "settings": "minecraft:void",
                    "biome_source": {
                        "type": "minecraft:multi_noise",
                        "preset": "minecraft:overworld"
                    }
                }
            }
        }
    });
})