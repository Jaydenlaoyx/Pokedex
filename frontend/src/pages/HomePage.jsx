import React, { useState } from "react";
import { fetchPokemonByName } from "../services/api";
import styles from "../styles/HomePage.module.css";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState(null);

  const handleSearch = async () => {
    if (!search) return;
    const data = await fetchPokemonByName(search);
    setPokemon(data);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome to the Pokedex</h2>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search a Pokemon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {pokemon && (
        <div className={styles.pokemonCard}>
          <h3>{pokemon.name}</h3>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <p>Types: {pokemon.types.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
