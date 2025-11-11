import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/PokemonPage.module.css";

const PokemonPage = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        // Fetch basic data from your backend (DB)
        const res = await fetch(`http://localhost:5050/api/pokemon/${name}`);
        if (!res.ok) throw new Error("Failed to load Pokémon");
        const data = await res.json();
        setPokemon(data);
        setLoading(false);

        // Fetch evolution chain dynamically from PokéAPI
        const resSpecies = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${name}`
        );
        const speciesData = await resSpecies.json();

        const resEvolution = await fetch(speciesData.evolution_chain.url);
        const evoData = await resEvolution.json();

        setEvolutionChain(parseEvolution(evoData.chain));
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [name]);

  // Helper to parse the nested evolution chain
  const parseEvolution = (chain) => {
    const evoArray = [];
    let current = chain;

    while (current) {
      evoArray.push(current.species.name);
      if (current.evolves_to.length > 0) {
        current = current.evolves_to[0];
      } else {
        current = null;
      }
    }

    return evoArray;
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (!pokemon) return <p className={styles.loading}>Failed to load Pokémon. Please try again.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </h1>

      <img
        src={pokemon.sprite || "https://via.placeholder.com/150"}
        alt={pokemon.name}
        className={styles.sprite}
      />

      {/* Types */}
      <div className={styles.types}>
        {pokemon.types?.map((type) => (
          <span key={type} className={`${styles.type} ${styles[type]}`}>
            {type}
          </span>
        ))}
      </div>

      {/* Evolution chain */}
      {evolutionChain.length > 0 && (
        <div className={styles.evolution}>
          <h2>Evolution Chain</h2>
          <div className={styles.evoChain}>
            {evolutionChain.map((p, idx) => (
              <React.Fragment key={p}>
                <span>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
                {idx < evolutionChain.length - 1 && <span className={styles.arrow}>→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Stats (optional if stored in DB) */}
      {pokemon.stats && (
        <div className={styles.stats}>
          {pokemon.stats.map((stat) => (
            <div key={stat.name} className={styles.stat}>
              <span>{stat.name}</span>
              <span>{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonPage;
