import mongoose from "mongoose";

const evolutionSchema = new mongoose.Schema({
  name: String,
  sprite: String,
});

const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nationalDexNumber: { type: Number },
  generation: { type: Number, required: true }, // <- added this
  types: [String],
  species: { type: String },
  height: { type: Number },
  weight: { type: Number },
  abilities: [String],
  sprite: { type: String },
  description: { type: String },
  evolution_chain: [evolutionSchema],
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema);
export default Pokemon;
