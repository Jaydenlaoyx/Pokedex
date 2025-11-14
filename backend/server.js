// server.js (full)
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import pokemonRoutes from "./src/routes/pokemonRoutes.js";
import itemRoutes from "./src/routes/itemRoutes.js";

dotenv.config();
const app = express();

// Enable JSON parsing
app.use(express.json());

// CORS - allow frontend
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Base
app.get("/", (req, res) => res.send("Pokedex API is running"));

// Healthcheck that also reports Mongo state
app.get("/api/healthcheck", (req, res) => {
  const state = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  res.json({ status: "ok", mongoState: state });
});

// Routes
app.use("/api/pokemon", pokemonRoutes);
app.use("/api/items", itemRoutes);

// Connect to Mongo and start server
const PORT = process.env.PORT || 5050;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // fail fast if cannot connect
})
.then(() => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  // still start server so you can inspect routes (optional)
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (DB disconnected)`));
});
