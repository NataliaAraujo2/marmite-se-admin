import styles from "./ProductCard.module.css";
import React from "react";

const ProductCard = ({ src, name, price, description, action }) => {

    const handlePrice = (e) => {
    e.preventDefault();
    const onlyDigits = e.target.value
      .split("")
      .filter((s) => /\d/.test(s))
      .join("")
      .padStart(0, "0");

    const renderPrice = onlyDigits.slice(0, -2) + "," + onlyDigits.slice(-2);
    e.target.value = renderPrice;
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.image}>
        <img src={src} alt={name} />
      </div>
      <span className={styles.name}>{name}</span>
      <label className={styles.description}>{description}</label>
      <div className={styles.priceAdd}>
        <div>
          <span className={styles.price} onChange={handlePrice}>R${price}</span>
        </div>
        <div className={styles.add}>
          <button onClick={action}>+</button>
          <span>1</span>
          <button className={styles.minus} onClick={action}>-</button>
        </div>
      </div>

   
    </div>
  );
};

export default ProductCard;
