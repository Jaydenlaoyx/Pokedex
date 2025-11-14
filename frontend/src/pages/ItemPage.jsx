// frontend/src/pages/ItemPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/ItemPage.module.css";

const ItemPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5050/api/items/${encodeURIComponent(name)}`);
        if (!res.ok) throw new Error("Failed to load item");
        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [name]);

  if (loading) return <div className={styles.loading}>Loading item...</div>;
  if (!item) return <div className={styles.error}>Item not found</div>;

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
      <div className={styles.card}>
        <div className={styles.imageSection}>
          {item.sprite ? <img src={item.sprite} alt={item.displayName || item.name} className={styles.sprite} /> : <div className={styles.spritePlaceholder} />}
          <h1 className={styles.title}>{item.displayName || item.name}</h1>
          <div className={styles.category}>{item.category?.toUpperCase()}</div>
        </div>

        <div className={styles.content}>
          <p className={styles.short}>{item.short_effect}</p>
          <div className={styles.effect}>{item.effect}</div>

          <div className={styles.meta}>
            <div><strong>Cost:</strong> {item.cost ? `${item.cost} Poké` : "—"}</div>
            <div><strong>Metadata:</strong> {item.metadata ? JSON.stringify(item.metadata) : "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
