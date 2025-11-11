import express from "express";
import { getAllPokemon, getPokemonByName, getPokemonNames } from "../controllers/pokemonController.js";

const router = express.Router();

// Autocomplete: all names
router.get("/names/all", getPokemonNames);

// Get single Pokémon by name
router.get("/:name", getPokemonByName);

// Get full Pokémon list
router.get("/", getAllPokemon);

export default router;
