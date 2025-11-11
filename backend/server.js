import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import pokemonRoutes from "./src/routes/pokemonRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/pokemon", pokemonRoutes);

// Base route
app.get("/", (req, res) => res.send("✅ Pokedex API is running!"));

// Start server after connecting to DB
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
