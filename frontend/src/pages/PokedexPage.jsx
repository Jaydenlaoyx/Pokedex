import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/PokedexPage.module.css";

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

const hexToRgba = (hex, alpha = 0.25) => {
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

const PokedexPage = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [genFilter, setGenFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/pokemon");
        if (!res.ok) throw new Error("Failed to fetch Pokémon");
        const data = await res.json();
        setPokemonList(data);
        setFilteredList(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...pokemonList];

    if (typeFilter) {
      filtered = filtered.filter((p) => p.types.includes(typeFilter));
    }

    if (genFilter) {
      filtered = filtered.filter(
        (p) =>
          (genFilter === "1" && p.nationalDexNumber <= 151) ||
          (genFilter === "2" && p.nationalDexNumber > 151 && p.nationalDexNumber <= 251) ||
          (genFilter === "3" && p.nationalDexNumber > 251 && p.nationalDexNumber <= 386)
          // add more generations if needed
      );
    }

    setFilteredList(filtered);
  }, [typeFilter, genFilter, pokemonList]);

  if (loading) return <p className={styles.loading}>Loading Pokedex...</p>;

  return (
    <div className={styles.container}>
      {/* Filters */}
      <div className={styles.filters}>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Types</option>
          {Object.keys(typeColors).map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={genFilter}
          onChange={(e) => setGenFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Generations</option>
          <option value="1">Generation 1</option>
          <option value="2">Generation 2</option>
          <option value="3">Generation 3</option>
          {/* Add more generations if needed */}
        </select>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {filteredList.map((p) => (
          <div
            key={p.name}
            className={styles.card}
            onClick={() => navigate(`/pokemon/${p.name}`)}
          >
            <div className={styles.number}>#{String(p.nationalDexNumber).padStart(3, "0")}</div>
            <img src={p.sprite} alt={p.name} className={styles.sprite} />
            <div className={styles.name}>{p.name.toUpperCase()}</div>
            <div className={styles.types}>
              {p.types?.map((type) => {
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
