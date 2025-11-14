// backend/src/models/Item.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  displayName: { type: String }, // optional prettier name
  category: { type: String }, // e.g. 'ball', 'healing', 'evolution', 'battle', 'vitamin'
  short_effect: { type: String }, // short summary
  effect: { type: String }, // long effect / description
  sprite: { type: String }, // image URL (optional)
  cost: { type: Number }, // optional
  metadata: { type: mongoose.Schema.Types.Mixed }, // any extra fields
});

const Item = mongoose.model("Item", itemSchema);
export default Item;
