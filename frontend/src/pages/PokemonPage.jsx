import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "../styles/PokemonPage.module.css";

const PokemonPage = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [evolutionSprites, setEvolutionSprites] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(`http://localhost:5050/api/pokemon/${name}`);
        if (!response.ok) throw new Error("Failed to load Pokémon");
        const data = await response.json();
        setPokemon(data);

        // Fetch sprites for evolution chain
        if (data.evolution_chain) {
          const sprites = {};
          for (let evoName of data.evolution_chain) {
            const evoRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
            const evoData = await evoRes.json();
            sprites[evoName] = evoData.sprites.front_default;
          }
          setEvolutionSprites(sprites);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchPokemon();
  }, [name]);

  if (error) return <p className={styles.error}>{error}</p>;
  if (!pokemon) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>
        ← Back to Pokedex
      </Link>

      <h1 className={styles.title}>
        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </h1>

      <img
        className={styles.image}
        src={pokemon.sprite}
        alt={pokemon.name}
      />

      <p>
        <strong>Type:</strong> {pokemon.type?.join(", ")}
      </p>
      <p>
        <strong>Description:</strong> {pokemon.description}
      </p>

      {pokemon.evolution_chain && (
        <div className={styles.evolutionSection}>
          <h2>Evolution Chain</h2>
          <div className={styles.evolutionList}>
            {pokemon.evolution_chain.map((evo) => (
              <Link
                key={evo}
                to={`/pokemon/${evo}`}
                className={styles.evolutionCard}
              >
                <img
                  src={evolutionSprites[evo]}
                  alt={evo}
                  className={styles.evolutionImage}
                />
                <p>{evo.charAt(0).toUpperCase() + evo.slice(1)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonPage;
