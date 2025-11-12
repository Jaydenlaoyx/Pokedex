import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import Pokemon from "../models/Pokemon.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const BATCH_SIZE = 10; // number of Pokémon to fetch in parallel

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const fetchPokemonDetails = async (entry) => {
  try {
    const pokemonData = await axios.get(entry.url);
    const speciesData = await axios.get(pokemonData.data.species.url);

    const types = pokemonData.data.types.map(t => t.type.name);
    const abilities = pokemonData.data.abilities.map(a => a.ability.name);
    const descriptionEntry = speciesData.data.flavor_text_entries.find(
      e => e.language.name === "en"
    );

    const description = descriptionEntry
      ? descriptionEntry.flavor_text.replace(/\f/g, " ").replace(/\n/g, " ")
      : "No description available.";

    // Fetch evolution chain
    const evolutionUrl = speciesData.data.evolution_chain.url;
    const evolutionData = await axios.get(evolutionUrl);

    const chain = [];
    let current = evolutionData.data.chain;
    while (current) {
      const evoName = current.species.name;
      const evoData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
      chain.push({
        name: evoName,
        sprite: evoData.data.sprites.other["official-artwork"].front_default,
      });
      current = current.evolves_to[0];
    }

    return {
      name: pokemonData.data.name,
      nationalDexNumber: pokemonData.data.id,
      types,
      species: speciesData.data.genera.find(g => g.language.name === "en")?.genus || "",
      height: pokemonData.data.height / 10,
      weight: pokemonData.data.weight / 10,
      abilities,
      sprite: pokemonData.data.sprites.other["official-artwork"].front_default,
      description,
      evolution_chain: chain,
    };
  } catch (err) {
    console.error("⚠️ Error fetching Pokémon:", entry.name, err.message);
    return null;
  }
};

const seedPokemon = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding");

    const limit = 386; // Gen 1-3
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    const allEntries = data.results;

    // Process Pokémon in batches
    for (let i = 0; i < allEntries.length; i += BATCH_SIZE) {
      const batch = allEntries.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(batch.map(fetchPokemonDetails));

      // Insert valid Pokémon into DB
      for (const p of results.filter(Boolean)) {
        await Pokemon.updateOne(
          { name: p.name },
          { $setOnInsert: p },
          { upsert: true }
        );
        console.log(`✅ Seeded ${p.name}`);
      }

      // Optional: small delay to avoid API rate limits
      await sleep(500); 
    }

    console.log("🌱 Gen 1‑3 Pokémon seeding complete!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
    process.exit(1);
  }
};

seedPokemon();
