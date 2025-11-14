// backend/src/seed/seedItems.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Item from "../models/Item.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const ITEMS = [
  /* ==== BALLS: standard + special ==== */
  {
    name: "poke-ball",
    displayName: "Poké Ball",
    category: "ball",
    short_effect: "Catches wild Pokémon",
    effect: "A device for catching wild Pokémon. It's thrown like a ball at a Pokémon in the field.",
    sprite: "", cost: 200
  },
  {
    name: "great-ball",
    displayName: "Great Ball",
    category: "ball",
    short_effect: "Better than a Poké Ball",
    effect: "Higher catch rate than a Poké Ball.",
    sprite: "", cost: 600
  },
  {
    name: "ultra-ball",
    displayName: "Ultra Ball",
    category: "ball",
    short_effect: "High catch rate",
    effect: "Better catch rate than a Great Ball.",
    sprite: "", cost: 1200
  },
  {
    name: "master-ball",
    displayName: "Master Ball",
    category: "ball",
    short_effect: "Guaranteed catch",
    effect: "A ball that will catch any wild Pokémon without fail.",
    sprite: "", cost: 0
  },
  {
    name: "quick-ball",
    displayName: "Quick Ball",
    category: "ball",
    short_effect: "Works best if used first",
    effect: "A ball that works especially well when used at the start of a wild encounter.",
    sprite: "", cost: 600
  },
  {
    name: "dive-ball",
    displayName: "Dive Ball",
    category: "ball",
    short_effect: "Works when fishing or surfing",
    effect: "Works well on Pokémon that live underwater.",
    sprite: "", cost: 500
  },
  {
    name: "safari-ball",
    displayName: "Safari Ball",
    category: "ball",
    short_effect: "Used in Safari Zones",
    effect: "A special Poké Ball used only in the Safari Zone.",
    sprite: "", cost: 0
  },

  /* ==== HEALING: common healing items (comprehensive) ==== */
  { name: "potion", displayName: "Potion", category: "healing", short_effect: "Restores 20 HP", effect: "A spray-type medicine for treating wounds. It restores the HP of one Pokémon by 20 points.", sprite: "", cost: 300 },
  { name: "super-potion", displayName: "Super Potion", category: "healing", short_effect: "Restores 50 HP", effect: "A medicine that restores up to 50 HP.", sprite: "", cost: 700 },
  { name: "hyper-potion", displayName: "Hyper Potion", category: "healing", short_effect: "Restores 200 HP", effect: "A medicine that restores a large amount of HP (up to 200).", sprite: "", cost: 1500 },
  { name: "max-potion", displayName: "Max Potion", category: "healing", short_effect: "Fully restores HP", effect: "Fully restores a Pokémon's HP.", sprite: "", cost: 2000 },
  { name: "antidote", displayName: "Antidote", category: "healing", short_effect: "Cures poison", effect: "A medicine that heals a Pokémon that has been poisoned.", sprite: "", cost: 100 },
  { name: "awakening", displayName: "Awakening", category: "healing", short_effect: "Cures sleep", effect: "A medicine that wakes up a sleeping Pokémon.", sprite: "", cost: 120 },
  { name: "paralyze-heal", displayName: "Paralyze Heal", category: "healing", short_effect: "Cures paralysis", effect: "A medicine that cures paralysis.", sprite: "", cost: 120 },
  { name: "burn-heal", displayName: "Burn Heal", category: "healing", short_effect: "Cures burn", effect: "A medicine that heals a Pokémon's burn.", sprite: "", cost: 120 },
  { name: "ice-heal", displayName: "Ice Heal", category: "healing", short_effect: "Cures freeze", effect: "A medicine that defrosts a frozen Pokémon.", sprite: "", cost: 120 },
  { name: "full-restore", displayName: "Full Restore", category: "healing", short_effect: "Restores HP & status", effect: "Fully restores HP and cures all status conditions.", sprite: "", cost: 2500 },
  { name: "revive", displayName: "Revive", category: "healing", short_effect: "Revives fainted Pokémon", effect: "Revives a fainted Pokémon and restores half of its maximum HP.", sprite: "", cost: 1500 },
  { name: "max-revive", displayName: "Max Revive", category: "healing", short_effect: "Fully revives", effect: "Fully revives a fainted Pokémon and restores all of its HP.", sprite: "", cost: 5000 },
  { name: "full-heal", displayName: "Full Heal", category: "healing", short_effect: "Cures any status", effect: "A spray-type medicine that heals any major status condition.", sprite: "", cost: 800 },
  { name: "ether", displayName: "Ether", category: "healing", short_effect: "Restores PP to a move", effect: "Restores the PP of one move by up to 10 points.", sprite: "", cost: 300 },
  { name: "elixir", displayName: "Elixir", category: "healing", short_effect: "Restores PP to all moves", effect: "Fully restores the PP of one Pokémon's moves.", sprite: "", cost: 1500 },

  /* ==== EVOLUTION: stones + special ==== */
  { name: "fire-stone", displayName: "Fire Stone", category: "evolution", short_effect: "Evolves certain species", effect: "A peculiar stone that can make certain species of Pokémon evolve.", sprite: "", cost: 2100 },
  { name: "water-stone", displayName: "Water Stone", category: "evolution", short_effect: "Evolves certain species", effect: "A peculiar stone that can make certain species of Pokémon evolve.", sprite: "", cost: 2100 },
  { name: "thunder-stone", displayName: "Thunder Stone", category: "evolution", short_effect: "Evolves certain species", effect: "A peculiar stone that can make certain species of Pokémon evolve.", sprite: "", cost: 2100 },
  { name: "leaf-stone", displayName: "Leaf Stone", category: "evolution", short_effect: "Evolves certain species", effect: "A peculiar stone that can make certain species of Pokémon evolve.", sprite: "", cost: 2100 },
  { name: "moon-stone", displayName: "Moon Stone", category: "evolution", short_effect: "Evolves certain species", effect: "A peculiar stone that can make certain species of Pokémon evolve.", sprite: "", cost: 2100 },
  { name: "sun-stone", displayName: "Sun Stone", category: "evolution", short_effect: "Evolves certain species", effect: "A peculiar stone that can make certain species of Pokémon evolve.", sprite: "", cost: 2100 },
  { name: "king's-rock", displayName: "King's Rock", category: "evolution", short_effect: "Held item; evolution in trades", effect: "May cause Pokémon to evolve when traded while holding it (in certain games).", sprite: "", cost: 1000 },

  /* ==== BATTLE: basic + vitamins ==== */
  { name: "x-attack", displayName: "X Attack", category: "battle", short_effect: "Raises Attack in battle", effect: "Temporarily raises a Pokémon's Attack stat in battle.", sprite: "", cost: 300 },
  { name: "x-defense", displayName: "X Defense", category: "battle", short_effect: "Raises Defense in battle", effect: "Temporarily raises a Pokémon's Defense stat in battle.", sprite: "", cost: 300 },
  { name: "dire-hit", displayName: "Dire Hit", category: "battle", short_effect: "Boosts critical hit rate", effect: "Boosts a Pokémon's critical hit ratio in battle.", sprite: "", cost: 450 },
  { name: "protein", displayName: "Protein", category: "vitamin", short_effect: "Raises Attack stat (permanent)", effect: "A savory protein that raises the base Attack stat.", sprite: "", cost: 2500 },
  { name: "iron", displayName: "Iron", category: "vitamin", short_effect: "Raises Defense stat (permanent)", effect: "A compact iron that raises the base Defense stat.", sprite: "", cost: 2500 },
  { name: "calcium", displayName: "Calcium", category: "vitamin", short_effect: "Raises Special Attack", effect: "A mysterious fluid that raises the base Special Attack stat.", sprite: "", cost: 2500 },
  { name: "zinc", displayName: "Zinc", category: "vitamin", short_effect: "Raises Special Defense", effect: "An energizing mineral that raises the base Special Defense stat.", sprite: "", cost: 2500 },
  { name: "carbos", displayName: "Carbos", category: "vitamin", short_effect: "Raises Speed", effect: "A carb-rich snack that raises the base Speed stat.", sprite: "", cost: 2500 },
  { name: "hp-up", displayName: "HP Up", category: "vitamin", short_effect: "Raises HP stat", effect: "A pill that raises the base HP stat.", sprite: "", cost: 2500 }
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for items seeding");

    // Remove existing items (optional)
    await Item.deleteMany({});
    console.log("Cleared items collection");

    // Normalize name keys
    const prepared = ITEMS.map((it) => {
      return {
        ...it,
        name: it.name.toLowerCase().replace(/\s+/g, "-"),
        displayName: it.displayName || it.name,
      };
    });

    await Item.insertMany(prepared);
    console.log(`Inserted ${prepared.length} items`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seed();
