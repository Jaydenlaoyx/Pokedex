import React, { useState, useEffect } from "react";
import { fetchAllPokemonNames } from "../services/api";
import { useNavigate } from "react-router-dom";
import styles from "../styles/HomePage.module.css";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [allNames, setAllNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getNames = async () => {
      try {
        const data = await fetchAllPokemonNames();
        console.log("All Pokémon names:", data);
        setAllNames(data.map(p => p.name));
      } catch (error) {
        console.error("Error fetching Pokémon names:", error);
      }
    };
    getNames();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const regex = new RegExp(`^${value}`, "i");
    const filtered = allNames.filter(name => regex.test(name));
    setSuggestions(filtered.slice(0, 5));
  };

  const handleSuggestionClick = (name) => {
    navigate(`/pokemon/${name}`);
    setSearch(name);
    setSuggestions([]);
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
    </div>
  );
}
