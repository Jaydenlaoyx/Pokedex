import Pokemon from "../models/Pokemon.js";

// Get all Pokémon (for Pokedex page)
export const getAllPokemon = async (req, res) => {
  try {
    const pokemons = await Pokemon.find(); // fetch all Pokémon
    res.json(pokemons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Pokémon by name (for PokemonPage)
export const getPokemonByName = async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ name: req.params.name.toLowerCase() });
    if (!pokemon) return res.status(404).json({ message: "Pokémon not found" });
    res.json(pokemon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all Pokémon names (for autocomplete)
export const getPokemonNames = async (req, res) => {
  try {
    const pokemons = await Pokemon.find({}, "name");
    const names = pokemons.map((p) => p.name);
    res.json(names);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
