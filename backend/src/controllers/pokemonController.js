import Pokemon from "../models/Pokemon.js";

// Get all Pokémon (limited for now)
export const getAllPokemon = async (req, res) => {
  try {
    const pokemons = await Pokemon.find().limit(20);
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Pokémon by name
export const getPokemonByName = async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ name: req.params.name.toLowerCase() });
    if (!pokemon) return res.status(404).json({ message: "Pokemon not found" });
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Pokémon names
export const getPokemonNames = async (req, res) => {
  try {
    const pokemons = await Pokemon.find({}, "name"); // only fetch names
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
