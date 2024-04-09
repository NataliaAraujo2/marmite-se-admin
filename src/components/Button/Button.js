import React from "react";
import styles from "./Button.module.css";

const Button = ({ onClick, text, Icon }) => {
  return (
    <div>
      <button className={styles.button} onClick={onClick}>
      
        {text}

        <Icon />
      </button>
    </div>
  );
};

export default Button;
