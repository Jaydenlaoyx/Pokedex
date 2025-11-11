const API_BASE = "http://localhost:5050/api";

export const fetchAllPokemon = async () => {
  const res = await fetch(`${API_BASE}/pokemon`);
  return res.json();
};

export const fetchPokemonByName = async (name) => {
  const res = await fetch(`${API_BASE}/pokemon/${name.toLowerCase()}`);
  return res.json();
};

export const fetchAllPokemonNames = async () => {
  const res = await fetch("http://localhost:5050/api/pokemon/names/all");
  return res.json();
};
