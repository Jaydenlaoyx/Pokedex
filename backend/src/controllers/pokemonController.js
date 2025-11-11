import axios from "axios";
import Pokemon from "../models/Pokemon.js";

// Get all Pokémon (for full Pokedex)
export const getAllPokemon = async (req, res) => {
  try {
    const pokemons = await Pokemon.find();
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Pokémon names (for autocomplete)
export const getPokemonNames = async (req, res) => {
  try {
    const pokemons = await Pokemon.find({}, "name");
    res.json(pokemons.map((p) => p.name));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Pokémon by name, including evolution chain and sprite
export const getPokemonByName = async (req, res) => {
  try {
    const name = req.params.name.toLowerCase();
    const pokemon = await Pokemon.findOne({ name });

    if (!pokemon) return res.status(404).json({ message: "Pokémon not found" });

    // Fetch species data for evolution chain
    const speciesResponse = await axios.get(
      `https://pokeapi.co/api/v2/pokemon-species/${name}`
    );
    const evolutionUrl = speciesResponse.data.evolution_chain.url;

    // Fetch evolution chain
    const evolutionResponse = await axios.get(evolutionUrl);
    const evolution_chain = parseEvolutionChain(evolutionResponse.data.chain);

    // Fetch main Pokémon data for sprite
    const pokemonApiResponse = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${name}`
    );
    const spriteUrl = pokemonApiResponse.data.sprites.front_default;

    res.json({
      ...pokemon.toObject(),
      evolution_chain,
      sprite: spriteUrl, // Send sprite to frontend
    });
  } catch (error) {
    console.error("Error fetching Pokémon:", error.message);
    res.status(500).json({ message: "Failed to fetch Pokémon data" });
  }
};

// Helper to parse evolution chain recursively
const parseEvolutionChain = (chain) => {
  const result = [];
  let current = chain;
  while (current) {
    if (current.species && current.species.name) {
      result.push(current.species.name);
    }
    current = current.evolves_to && current.evolves_to.length > 0 ? current.evolves_to[0] : null;
  }
  return result;
};
