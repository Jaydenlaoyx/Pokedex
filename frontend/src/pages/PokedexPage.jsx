import React, { useEffect, useState } from "react";
import styles from "../styles/PokedexPage.module.css";
import { typeColors, hexToRgba } from "../utils/typeUtils";
import { useNavigate } from "react-router-dom";

const PokedexPage = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [generationFilter, setGenerationFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5050/api/pokemon");
        const data = await res.json();
        setPokemonList(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPokemon();
  }, []);

  const filteredPokemon = pokemonList.filter((p) => {
    const typeMatch = typeFilter ? p.types.includes(typeFilter) : true;
    const genMatch = generationFilter
      ? p.generation === parseInt(generationFilter)
      : true;
    return typeMatch && genMatch;
  });

  const handleCardClick = (name) => {
    navigate(`/pokemon/${name}`);
  };

  const shimmerArray = Array.from({ length: 16 });

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <select
          className={styles.filterSelect}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          {Object.keys(typeColors).map((type) => (
            <option key={type} value={type}>
              {type.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          className={styles.filterSelect}
          value={generationFilter}
          onChange={(e) => setGenerationFilter(e.target.value)}
        >
          <option value="">All Generations</option>
          {[...Array(9).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              Gen {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.grid}>
        {loading
          ? shimmerArray.map((_, idx) => (
              <div key={idx} className={`${styles.card} ${styles.shimmer}`}>
                <div className={styles.spritePlaceholder}></div>
                <div className={styles.namePlaceholder}></div>
                <div className={styles.typePlaceholder}></div>
              </div>
            ))
          : filteredPokemon.map((p, idx) => (
              <div
                key={p.name}
                className={`${styles.card} ${styles.fadeIn}`}
                style={{ animationDelay: `${idx * 50}ms` }} // stagger effect
                onClick={() => handleCardClick(p.name)}
              >
                <div className={styles.number}>
                  #{String(p.nationalDexNumber).padStart(3, "0")}
                </div>
                <div className={styles.name}>{p.name.toUpperCase()}</div>
                <img src={p.sprite} alt={p.name} className={styles.sprite} />
                <div className={styles.types}>
                  {p.types.map((type) => {
                    const hex = typeColors[type] || "#777";
                    return (
                      <span
                        key={type}
                        className={styles.typeBadge}
                        style={{
                          backgroundColor: hexToRgba(hex, 0.35),
                          borderColor: hexToRgba(hex, 0.5),
                          color: "#fff",
                        }}
                      >
                        {type.toUpperCase()}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default PokedexPage;
