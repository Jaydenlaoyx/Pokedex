import mongoose from "mongoose";

const evolutionSchema = new mongoose.Schema({
  name: String,
  sprite: String,
});

const statSchema = new mongoose.Schema({
  name: String,
  base_stat: Number,
});

const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nationalDexNumber: { type: Number },
  generation: { type: Number },
  types: [String],
  species: { type: String },
  height: { type: Number },
  weight: { type: Number },
  abilities: [String],
  sprite: { type: String },
  shinySprite: { type: String },
  description: { type: String },
  evolution_chain: [evolutionSchema],
  stats: [statSchema],
  moves: [String],
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema);
export default Pokemon;
