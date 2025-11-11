import express from "express";
import { getAllPokemon, getPokemonByName, getPokemonNames } from "../controllers/pokemonController.js";

const router = express.Router();

// ✅ Specific routes must come before dynamic ones
router.get("/names/all", getPokemonNames);
router.get("/:name", getPokemonByName);
router.get("/", getAllPokemon);

export default router;
