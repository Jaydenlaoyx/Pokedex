import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/PokemonPage.module.css";

const PokemonPage = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);

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
  if (!pokemon) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.name}>
        #{pokemon.nationalDexNumber} {pokemon.name.toUpperCase()}
      </h1>

      <img
        src={pokemon.sprite}
        alt={pokemon.name}
        className={styles.sprite}
      />

      <p className={styles.description}>{pokemon.description}</p>

      <div className={styles.infoGrid}>
        <div><strong>Species:</strong> {pokemon.species}</div>
        <div><strong>Type:</strong> {pokemon.types?.join(", ")}</div>
        <div><strong>Height:</strong> {pokemon.height} m</div>
        <div><strong>Weight:</strong> {pokemon.weight} kg</div>
        <div><strong>Abilities:</strong> {pokemon.abilities?.join(", ")}</div>
      </div>

      <div className={styles.evolution}>
        <h3>Evolution Chain</h3>
        <div className={styles.chain}>
          {pokemon.evolution_chain?.map((evo, index) => (
            <span key={index}>
              {evo}
              {index < pokemon.evolution_chain.length - 1 && " → "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonPage;
