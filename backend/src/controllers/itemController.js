// backend/src/controllers/itemController.js
import Item from "../models/Item.js";

/**
 * GET /api/items
 * Optional query params:
 *  - category (filter by category)
 *  - q (text search by name)
 */
export const getAllItems = async (req, res) => {
  try {
    const { category, q } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.name = { $regex: q, $options: "i" };

    const items = await Item.find(filter).sort({ name: 1 });
    res.json(items);
  } catch (err) {
    console.error("getAllItems error:", err);
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

/**
 * GET /api/items/:name
 * name is the item.name (lowercase slug recommended)
 */
export const getItemByName = async (req, res) => {
  try {
    const name = req.params.name;
    if (!name) return res.status(400).json({ message: "Item name required" });

    // find by exact name or displayName (case-insensitive)
    const item = await Item.findOne({
      $or: [{ name: name.toLowerCase() }, { displayName: new RegExp(`^${name}$`, "i") }],
    });

    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    console.error("getItemByName error:", err);
    res.status(500).json({ message: "Failed to fetch item" });
  }
};

/**
 * GET /api/items/categories - optional helper to list categories
 */
export const getItemCategories = async (req, res) => {
  try {
    const categories = await Item.distinct("category");
    res.json(categories);
  } catch (err) {
    console.error("getItemCategories error:", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};
