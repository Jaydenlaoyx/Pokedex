import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import PokemonPage from "./pages/PokemonPage";
import PokedexPage from "./pages/PokedexPage";
import Navbar from "./components/Navbar";
import "./styles/global.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pokemon/:name" element={<PokemonPage />} />
          <Route path="/pokedex" element={<PokedexPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
