import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Pokedex</Link>
      </div>
      <ul className={styles.navLinks}>
        <li><Link to="/pokedex">Pokedex</Link></li>
        <li><Link to="/items">Items</Link></li>
        <li><Link to="/moves">Moves</Link></li>
      </ul>
      <button className={styles.toggleBtn} onClick={toggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </nav>
  );
};

export default Navbar;
