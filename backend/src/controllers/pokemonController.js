import Pokemon from "../models/Pokemon.js";

// ✅ Return all Pokémon
export const getAllPokemon = async (req, res) => {
  try {
    const pokemons = await Pokemon.find({});
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Return all Pokémon names (for search bar)
export const getPokemonNames = async (req, res) => {
  try {
    const pokemons = await Pokemon.find({}, { name: 1, _id: 0 });
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Return Pokémon by name (case-insensitive)
export const getPokemonByName = async (req, res) => {
  const { name } = req.params;
  try {
    const pokemon = await Pokemon.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (!pokemon) return res.status(404).json({ message: `Pokemon '${name}' not found` });
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
