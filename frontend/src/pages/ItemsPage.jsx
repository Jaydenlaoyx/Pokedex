// frontend/src/pages/ItemsPage.jsx
import React, { useEffect, useState } from "react";
import styles from "../styles/ItemsPage.module.css";
import ItemCard from "../components/ItemCard";
import { useNavigate } from "react-router-dom";

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const q = new URLSearchParams();
        if (categoryFilter) q.set("category", categoryFilter);
        if (query) q.set("q", query);
        const url = `http://localhost:5050/api/items?${q.toString()}`;
        const res = await fetch(url);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [categoryFilter, query]);

  const categories = ["", "ball", "healing", "evolution", "battle", "vitamin"];

  const handleCardClick = (name) => {
    navigate(`/items/${encodeURIComponent(name)}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Items</h2>
        <div className={styles.controls}>
          <select className={styles.filterSelect} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All categories</option>
            {categories.filter(c => c).map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
          <input className={styles.searchInput} placeholder="Search items..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <div className={styles.grid}>
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`${styles.cardWrapper} ${styles.shimmer}`}>
              <div className={styles.spritePlaceholder} />
              <div className={styles.namePlaceholder} />
              <div className={styles.typePlaceholder} />
            </div>
          ))
        ) : (
          items.map((it) => <ItemCard key={it.name} item={it} onClick={handleCardClick} />)
        )}
      </div>
    </div>
  );
};

export default ItemsPage;
