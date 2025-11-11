// frontend/src/pages/PokemonPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "../styles/PokemonPage.module.css";

const PokemonPage = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setError(null);
        const response = await fetch(`http://localhost:5050/api/pokemon/${name}`);
        if (!response.ok) throw new Error(`Failed to fetch Pokémon: ${response.status}`);
        const data = await response.json();
        setPokemon(data);
      } catch (err) {
        console.error("Error fetching Pokémon:", err);
        setError("Failed to load Pokémon. Please try again.");
      }
    };
    fetchPokemon();
  }, [name]);

  if (error) return <p className={styles.error}>{error}</p>;
  if (!pokemon) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        &larr; Back to Home
      </Link>

      <div className={styles.card}>
        <div className={styles.flexRow}>
          <div>
            <img
              src={pokemon.sprites?.front_default}
              alt={pokemon.name}
              className={styles.image}
            />
            <h1 className={styles.name}>{pokemon.name}</h1>
          </div>

          <div>
            <p className={styles.description}>
              {pokemon.description || "No description available."}
            </p>

            <div>
              <h2 className={styles.sectionTitle}>Types</h2>
              <div>
                {pokemon.types?.map((type, idx) => (
                  <span key={idx} className={styles.typeBadge}>
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <h2 className={styles.sectionTitle}>Stats</h2>
              <ul className={styles.statList}>
                {pokemon.stats?.map((stat, index) => (
                  <li key={index} className={styles.statItem}>
                    <span className={styles.statName}>{stat.name}</span>
                    <span className={styles.statValue}>{stat.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        Powered by PokéAPI • Designed by Jayden Lao
      </footer>
    </div>
  );
};

export default PokemonPage;
