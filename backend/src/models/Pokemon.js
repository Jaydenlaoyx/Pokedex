import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  types: [String],
  sprites: {
    front_default: String,
  },
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema);
export default Pokemon;
