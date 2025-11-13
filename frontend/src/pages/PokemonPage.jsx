// frontend/src/pages/PokemonPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/PokemonPage.module.css";
import { typeColors, hexToRgba } from "../utils/typeUtils";

export default function PokemonPage() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShiny, setShowShiny] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!name) return;
    const controller = new AbortController();

    const fetchPokemon = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `http://localhost:5050/api/pokemon/${encodeURIComponent(name)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();

        // Normalize stats
        let normalizedStats = [];
        if (Array.isArray(data.stats)) {
          if (data.stats.length > 0 && data.stats[0].stat && data.stats[0].stat.name) {
            normalizedStats = data.stats.map((s) => ({ name: s.stat.name, base_stat: s.base_stat }));
          } else if (data.stats.length > 0 && data.stats[0].name) {
            normalizedStats = data.stats.map((s) => ({ name: s.name, base_stat: s.base_stat ?? 0 }));
          } else {
            normalizedStats = data.stats.map((s, i) => ({ name: `stat${i}`, base_stat: s.base_stat ?? 0 }));
          }
        }

        // Normalize moves
        let normalizedMoves = [];
        if (Array.isArray(data.moves)) {
          if (typeof data.moves[0] === "string") normalizedMoves = data.moves;
          else if (data.moves[0] && data.moves[0].move && data.moves[0].move.name) normalizedMoves = data.moves.map(m => m.move.name);
          else normalizedMoves = data.moves.map(m => m.name || m);
        }

        const evoChain = Array.isArray(data.evolution_chain) ? data.evolution_chain : [];

        setPokemon({
          ...data,
          stats: normalizedStats,
          moves: normalizedMoves,
          evolution_chain: evoChain,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(err.message || "Failed to load Pokémon");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
    return () => controller.abort();
  }, [name]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading Pokémon...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error}</div>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Pokémon not found</div>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
      </div>
    );
  }

  const normalSprite = pokemon.sprite || (pokemon.sprites && (pokemon.sprites.front_default || pokemon.sprites.other?.["official-artwork"]?.front_default)) || "";
  const shinySprite = pokemon.shinySprite || (pokemon.sprites && (pokemon.sprites.front_shiny || pokemon.sprites.other?.["official-artwork"]?.front_shiny)) || "";

  const typeStyle = (typeName) => {
    if (!typeName) return {};
    const color = typeColors[typeName.toLowerCase()] || "#777";
    return {
      backgroundColor: hexToRgba(color, 0.25),
      borderColor: hexToRgba(color, 0.5),
      color: ["electric","grass","ice","ground","flying","bug","rock","steel","fairy"].includes(typeName.toLowerCase()) ? "#000" : "#fff",
    };
  };

  const renderEvolutionChain = (chain) =>
    chain.map((e, idx) => {
      const isLast = idx === chain.length - 1;
      return (
        <React.Fragment key={e.name + "-" + idx}>
          <div className={styles.evoCard}>
            {e.sprite ? (
              <img src={e.sprite} alt={e.name} className={styles.evoSprite} />
            ) : (
              <div className={styles.spritePlaceholder} />
            )}
            <div style={{ marginTop: 6, textTransform: "capitalize" }}>{e.name}</div>
          </div>
          {!isLast && <div className={styles.evoArrow} aria-hidden>→</div>}
        </React.Fragment>
      );
    });

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>

      <div className={styles.card}>
        <h1 className={styles.name}>
          #{String(pokemon.nationalDexNumber ?? pokemon.id ?? 0).padStart(3, "0")} {String(pokemon.name ?? "").toUpperCase()}
        </h1>

        <div className={styles.imageSection}>
          <img
            className={styles.sprite}
            src={showShiny && shinySprite ? shinySprite : normalSprite}
            alt={pokemon.name}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <button className={styles.shinyToggle} onClick={() => setShowShiny(s => !s)}>
            {showShiny ? "Show Normal" : "Show Shiny"}
          </button>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.types}>
            {(pokemon.types || []).map((t) => (
              <span key={t} className={styles.typeBadge} style={typeStyle(t)}>
                {t?.toUpperCase?.()}
              </span>
            ))}
          </div>

          {pokemon.description && <p className={styles.description}>{pokemon.description}</p>}

          <div className={styles.basicInfo}>
            <div><strong>Species</strong><div>{pokemon.species || "—"}</div></div>
            <div><strong>Height</strong><div>{pokemon.height ?? "—"} m</div></div>
            <div><strong>Weight</strong><div>{pokemon.weight ?? "—"} kg</div></div>
            <div><strong>Abilities</strong><div>{(pokemon.abilities || []).join(" | ") || "—"}</div></div>
          </div>

          <div className={styles.stats}>
            <h3>Base Stats</h3>
            {pokemon.stats && pokemon.stats.length > 0 ? (
              pokemon.stats.map((s) => (
                <div key={s.name} className={styles.stat}>
                  <div style={{ width: 110, textTransform: "capitalize" }}>{s.name}</div>
                  <div className={styles.bar} aria-hidden>
                    <div className={styles.fill} style={{ width: `${Math.min(100, (s.base_stat / 200) * 100)}%` }} />
                  </div>
                  <div style={{ width: 40, textAlign: "right" }}>{s.base_stat}</div>
                </div>
              ))
            ) : (
              <div>No stats available</div>
            )}
          </div>

          <div className={styles.moves}>
            <h3>Moves</h3>
            {Array.isArray(pokemon.moves) && pokemon.moves.length > 0 ? (
              <ul>
                {pokemon.moves.slice(0, 12).map((m) => (
                  <li key={m} className={styles.moveItem}>{m}</li>
                ))}
              </ul>
            ) : (
              <div>No moves available</div>
            )}
          </div>

          {Array.isArray(pokemon.evolution_chain) && pokemon.evolution_chain.length > 0 && (
            <div className={styles.evolution}>
              <h3>Evolution Chain</h3>
              <div className={styles.evoList}>
                {renderEvolutionChain(pokemon.evolution_chain)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
