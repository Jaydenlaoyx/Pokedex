import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import Pokemon from "../models/Pokemon.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const BATCH_SIZE = 20; // Number of Pokémon to fetch in parallel

const seedPokemon = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding");

    await Pokemon.deleteMany({});
    console.log("🗑️ Cleared existing Pokémon");

    const limit = 386; // Gen 1–3
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    const allPokemon = data.results;

    const fetchPokemonData = async (entry) => {
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

        // Determine generation
        const id = pokemonData.data.id;
        let generation = 1;
        if (id >= 152 && id <= 251) generation = 2;
        else if (id >= 252 && id <= 386) generation = 3;

        // Evolution chain
        let chain = [];
        try {
          const evolutionUrl = speciesData.data.evolution_chain.url;
          const evolutionData = await axios.get(evolutionUrl);
          let current = evolutionData.data.chain;
          while (current) {
            const evoName = current.species.name;
            try {
              const evoData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
              chain.push({
                name: evoName,
                sprite: evoData.data.sprites.other["official-artwork"].front_default,
              });
            } catch {}
            current = current.evolves_to[0];
          }
        } catch {}

        // Return a plain object (important!)
        return {
          name: pokemonData.data.name,
          nationalDexNumber: id,
          generation,
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
        console.warn(`⚠️ Skipping ${entry.name}: ${err.message}`);
        return null;
      }
    };

    // Batch fetch & save
    for (let i = 0; i < allPokemon.length; i += BATCH_SIZE) {
      const batch = allPokemon.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(batch.map(fetchPokemonData));
      const valid = results.filter(p => p !== null);
      if (valid.length > 0) {
        await Pokemon.insertMany(valid);
        console.log(`✅ Saved batch ${i + 1}-${i + valid.length}`);
      }
    }

    console.log("🌱 Pokémon seeding complete!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
    process.exit(1);
  }
};

seedPokemon();
