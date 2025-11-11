import express from "express";
import { getAllPokemon, getPokemonByName, getPokemonNames} from "../controllers/pokemonController.js";

const router = express.Router();

router.get("/", getAllPokemon);
router.get("/:name", getPokemonByName);
router.get("/names/all", getPokemonNames);


export default router;
