const API_BASE = "http://localhost:5050/api/pokemon";

// Fetch all Pokémon names (for autocomplete)
export const fetchAllPokemonNames = async () => {
  const res = await fetch(`${API_BASE}/names/all`);
  if (!res.ok) throw new Error(`Failed to fetch Pokémon names: ${res.status}`);
  return res.json(); // [{ name: "bulbasaur" }, ...]
};

// Fetch single Pokémon by name
export const fetchPokemonByName = async (name) => {
  const res = await fetch(`${API_BASE}/${name.toLowerCase()}`);
  if (!res.ok) throw new Error(`Failed to fetch Pokémon: ${res.status}`);
  return res.json();
};
