// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import PokemonPage from "./pages/PokemonPage";
import PokedexPage from "./pages/PokedexPage";
import ItemsPage from "./pages/ItemsPage";
import ItemPage from "./pages/ItemPage";
import Navbar from "./components/Navbar";
import "./styles/global.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pokemon/:id" element={<PokemonPage />} />
          <Route path="/pokedex" element={<PokedexPage />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/items/:name" element={<ItemPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
