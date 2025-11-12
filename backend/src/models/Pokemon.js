import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nationalDexNumber: { type: Number },
  types: [String],
  species: { type: String },
  height: { type: Number }, // in meters
  weight: { type: Number }, // in kilograms
  abilities: [String],
  sprite: { type: String },
  description: { type: String },
  evolution_chain: [String],
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema);
export default Pokemon;
