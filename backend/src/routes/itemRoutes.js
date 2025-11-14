// backend/src/routes/itemRoutes.js
import express from "express";
import { getAllItems, getItemByName, getItemCategories } from "../controllers/itemController.js";

const router = express.Router();

// list categories
router.get("/categories", getItemCategories);

// list (supports ?category=healing&q=potion)
router.get("/", getAllItems);

// get one item by name/slug
router.get("/:name", getItemByName);

export default router;
