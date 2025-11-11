import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
import Pokemon from "../models/Pokemon.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedPokemon = async () => {
  try {
    await connectDB();
    console.log("🌱 Starting Pokémon seeding...");

    const pokemons = [];

    for (let i = 1; i <= 151; i++) {
      const response = await axios.get(`${process.env.POKEAPI_BASE}/pokemon/${i}`);
      const data = response.data;

      pokemons.push({
        name: data.name,
        types: data.types.map(t => t.type.name),
        sprites: { front_default: data.sprites.front_default }
      });
    }

    await Pokemon.deleteMany();
    console.log("🗑️ Cleared old Pokémon data");

    await Pokemon.insertMany(pokemons);
    console.log("✅ Inserted 151 Pokémon");

    mongoose.connection.close();
    console.log("🔒 Connection closed");
  } catch (error) {
    console.error("❌ Error seeding Pokémon:", error.message);
    process.exit(1);
  }
};

seedPokemon();
