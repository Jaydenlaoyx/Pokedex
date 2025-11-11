import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/HomePage.module.css";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [allNames, setAllNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/pokemon/names/all");
        const data = await res.json();
        setAllNames(data);
      } catch (err) {
        console.error("Failed to fetch Pokémon names:", err);
      }
    };
    fetchNames();
  }, []);

  useEffect(() => {
    if (search.length === 0) {
      setFilteredNames([]);
      return;
    }
    const filtered = allNames.filter((name) =>
      name.toLowerCase().startsWith(search.toLowerCase())
    );
    setFilteredNames(filtered);
  }, [search, allNames]);

  const handleSelect = (name) => {
    navigate(`/pokemon/${name.toLowerCase()}`);
    setSearch("");
    setFilteredNames([]);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to the Pokedex</h1>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        {filteredNames.length > 0 && (
          <ul className={styles.dropdown}>
            {filteredNames.map((name) => (
              <li
                key={name}
                onClick={() => handleSelect(name)}
                className={styles.dropdownItem}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HomePage;
