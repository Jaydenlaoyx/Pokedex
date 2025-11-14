// frontend/src/components/ItemCard.jsx
import React from "react";
import styles from "../styles/ItemsPage.module.css";

const ItemCard = ({ item, onClick }) => {
  return (
    <div className={styles.cardWrapper} onClick={() => onClick(item.name)}>
      <div className={styles.cardGlow} />
      <div className={styles.card}>
        <div className={styles.spriteWrap}>
          {item.sprite ? (
            <img src={item.sprite} alt={item.displayName || item.name} className={styles.sprite} />
          ) : (
            <div className={styles.spritePlaceholder} />
          )}
        </div>
        <div className={styles.number}>#{String(item._id).slice(-4)}</div>
        <div className={styles.name}>{(item.displayName || item.name).toUpperCase()}</div>
        <div className={styles.types}>
          <span className={styles.typeBadge}>{item.category?.toUpperCase()}</span>
        </div>
        <div className={styles.short}>{item.short_effect}</div>
      </div>
    </div>
  );
};

export default ItemCard;
