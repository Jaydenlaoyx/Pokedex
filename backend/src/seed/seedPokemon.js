import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import Pokemon from "../models/Pokemon.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const BATCH_SIZE = 20;

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

        const types = pokemonData.data.types.map((t) => t.type.name);
        const abilities = pokemonData.data.abilities.map((a) => a.ability.name);

        const descriptionEntry = speciesData.data.flavor_text_entries.find(
          (e) => e.language.name === "en"
        );

        const description = descriptionEntry
          ? descriptionEntry.flavor_text.replace(/\f/g, " ").replace(/\n/g, " ")
          : "No description available.";

        const id = pokemonData.data.id;
        let generation = 1;
        if (id >= 152 && id <= 251) generation = 2;
        else if (id >= 252 && id <= 386) generation = 3;

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
            } catch {
              // skip if evo fetch fails
            }
            current = current.evolves_to[0];
          }
        } catch {
          chain = [];
        }

        return new Pokemon({
          name: pokemonData.data.name,
          nationalDexNumber: id,
          generation,
          types,
          species: speciesData.data.genera.find((g) => g.language.name === "en")?.genus || "",
          height: pokemonData.data.height / 10,
          weight: pokemonData.data.weight / 10,
          abilities,
          sprite: pokemonData.data.sprites.other["official-artwork"].front_default,
          shinySprite: pokemonData.data.sprites.other["official-artwork"].front_shiny,
          description,
          evolution_chain: chain,
          stats: pokemonData.data.stats.map((s) => ({
            name: s.stat.name,
            base_stat: s.base_stat,
          })),
          moves: pokemonData.data.moves.slice(0, 10).map((m) => m.move.name),
        });
      } catch (err) {
        console.warn(`⚠️ Skipping ${entry.name}: ${err.message}`);
        return null;
      }
    };

    for (let i = 0; i < allPokemon.length; i += BATCH_SIZE) {
      const batch = allPokemon.slice(i, i + BATCH_SIZE);
      const pokemonInstances = await Promise.all(batch.map(fetchPokemonData));

      const savedPokemons = pokemonInstances.filter((p) => p !== null);
      if (savedPokemons.length > 0) {
        await Pokemon.insertMany(savedPokemons);
        console.log(`✅ Saved batch ${i + 1}-${i + savedPokemons.length}`);
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
