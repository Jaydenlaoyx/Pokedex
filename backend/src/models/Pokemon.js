import mongoose from "mongoose";

const pokemonSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sprite: { type: String }, // sprite URL
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema);

export default Pokemon;
