import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/PokedexPage.module.css";

const PokedexPage = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/pokemon");
        const data = await res.json();
        setPokemons(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch all Pokémon:", err);
      }
    };

    fetchAllPokemon();
  }, []);

  if (loading) return <p className={styles.loading}>Loading Pokedex...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Full Pokedex</h1>

      {/* Filters (placeholder for now) */}
      <div className={styles.filters}>
        <select className={styles.filter}>
          <option value="">Filter by Type</option>
        </select>
        <select className={styles.filter}>
          <option value="">Filter by Generation</option>
        </select>
      </div>

      <div className={styles.grid}>
        {pokemons.map((pokemon) => (
          <Link
            to={`/pokemon/${pokemon.name}`}
            key={pokemon.name}
            className={styles.card}
          >
            <img
              src={pokemon.sprite || "https://via.placeholder.com/80"}
              alt={pokemon.name}
              className={styles.sprite}
            />
            <p className={styles.name}>
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PokedexPage;
