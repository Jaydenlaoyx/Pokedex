import React from "react";
import { useDarkMode } from "../context/DarkModeContext";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <nav className={`${styles.navbar} ${darkMode ? styles.dark : ""}`}>
      <h1 className={styles.title}>Pokedex</h1>
      <div className={styles.menu}>
        <button>Home</button>
        <button>Pokedex</button>
        <button>Items</button>
        <button>Moves</button>
        <button onClick={toggleDarkMode}>{darkMode ? "Light" : "Dark"} Mode</button>
      </div>
    </nav>
  );
}
