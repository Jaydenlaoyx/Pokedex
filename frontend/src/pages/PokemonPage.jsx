import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/PokemonPage.module.css";
import { ThemeContext } from "../context/ThemeContext";

const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const hexToRgba = (hex, alpha = 0.35) => {
  if (!hex) return `rgba(255,255,255,${alpha})`;
  const h = hex.replace("#", "");
  const bigint = parseInt(
    h.length === 3 ? h.split("").map((c) => c + c).join("") : h,
    16
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const PokemonPage = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch(`http://localhost:5050/api/pokemon/${name}`);
        if (!res.ok) throw new Error("Failed to fetch Pokémon");
        const data = await res.json();
        setPokemon(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPokemon();
  }, [name]);

  if (error) return <p className={styles.error}>{error}</p>;
  if (!pokemon) return <p className={styles.loading}>Loading...</p>;

  return (
    <div
      className={styles.container}
      data-theme={darkMode ? "dark" : "light"}
    >
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{pokemon.name.toUpperCase()}</h1>
          <div className={styles.types}>
            {pokemon.types?.map((type) => {
              const hex = typeColors[type] || "#777";
              return (
                <span
                  key={type}
                  className={styles.typeBadge}
                  style={{
                    backgroundColor: hexToRgba(hex, parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--badge-bg-opacity'))),
                    borderColor: hexToRgba(hex, 0.5),
                  }}
                >
                  {type.toUpperCase()}
                </span>
              );
            })}
          </div>
        </div>

        <div className={styles.mainRow}>
          <div className={styles.spriteCol}>
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              className={styles.sprite}
            />
          </div>

          <div className={styles.detailsCol}>
            <p className={styles.description}>{pokemon.description}</p>

            <div className={styles.detailGrid}>
              <div className={styles.detailRow}>
                <div className={styles.label}>National Dex</div>
                <div className={styles.value}>
                  #{String(pokemon.nationalDexNumber).padStart(3, "0")}
                </div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.label}>Species</div>
                <div className={styles.value}>{pokemon.species}</div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.label}>Height</div>
                <div className={styles.value}>{pokemon.height} m</div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.label}>Weight</div>
                <div className={styles.value}>{pokemon.weight} kg</div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.label}>Abilities</div>
                <div className={styles.value}>
                  {pokemon.abilities?.join(" | ")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {pokemon.evolution_chain && pokemon.evolution_chain.length > 0 && (
          <div className={styles.evolution}>
            <h3 className={styles.evoTitle}>Evolution Chain</h3>
            <div className={styles.evoChain}>
              {pokemon.evolution_chain.map((evo, idx) => (
                <React.Fragment key={evo.name}>
                  <div className={styles.evoItem}>
                    <img
                      src={evo.sprite}
                      alt={evo.name}
                      className={styles.evoSprite}
                    />
                    <div className={styles.evoName}>{evo.name}</div>
                  </div>
                  {idx < pokemon.evolution_chain.length - 1 && (
                    <div className={styles.evoArrow} aria-hidden>
                      →
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonPage;
