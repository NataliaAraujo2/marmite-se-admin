import React from "react";
import styles from "./ButtonLink.module.css";
import { NavLink } from "react-router-dom";

const ButtonLink = ({ to, text, Icon }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) => (isActive ? styles.active : styles.link)}
      >
        <span>{text}</span>
        <Icon />
      </NavLink>
    </li>
  );
};

export default ButtonLink;
