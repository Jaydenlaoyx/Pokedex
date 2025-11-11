import React, { useState, useEffect } from "react";
import { fetchAllPokemonNames, fetchPokemonByName } from "../services/api";
import styles from "../styles/HomePage.module.css";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [allNames, setAllNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [pokemon, setPokemon] = useState(null);

  // Fetch all Pokémon names on component mount
  useEffect(() => {
    const getNames = async () => {
      try {
        const data = await fetchAllPokemonNames();
        setAllNames(data.map(p => p.name)); // store only names
      } catch (error) {
        console.error("Error fetching Pokémon names:", error);
      }
    };
    getNames();
  }, []);

  // Handle input change and filter suggestions
  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const regex = new RegExp(`^${value}`, "i"); // starts with input
    const filtered = allNames.filter(name => regex.test(name));
    setSuggestions(filtered.slice(0, 5)); // top 5 matches
  };

  // Handle suggestion click
  const handleSuggestionClick = async (name) => {
    try {
      const data = await fetchPokemonByName(name);
      setPokemon(data);
      setSearch(name);
      setSuggestions([]);
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome to the Pokedex</h2>

      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search a Pokémon..."
          value={search}
          onChange={handleChange}
          className={styles.searchInput}
        />
        <ul className={styles.suggestions}>
          {suggestions.map(name => (
            <li
              key={name}
              onClick={() => handleSuggestionClick(name)}
              className={styles.suggestionItem}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>

      {pokemon && (
        <div className={styles.pokemonCard}>
          <h3 className={styles.pokemonName}>{pokemon.name}</h3>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <p>Types: {pokemon.types.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
