import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import styles from "./Navbar.module.css";
import logo from "../../images/logo-removebg.png";
import { useAuthValue } from "../../context/AuthContext";
import { useAuthentication } from "../../services/Auth/useAuthentication"
import Button from "../Button/Button";
import ButtonLink from "../Link/ButtonLink";
import { FaDoorClosed, FaDoorOpen } from "react-icons/fa";

const Navbar = () => {
  const [dateNow, setDateNow] = useState("");

  const { user } = useAuthValue();
  const { logout } = useAuthentication()

  useEffect(() => {
    const date = () => {
      const now = new Date();

      const dayName = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
      ];

      const monName = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "agosto",
        "outubro",
        "novembro",
        "dezembro",
      ];

      const agora = ` ${dayName[now.getDay()]}, ${now.getDate()} de ${
        monName[now.getMonth()]
      } de ${now.getFullYear()}`;

      setDateNow(agora);
    };

    date();

    return () => {};
  }, []);

 

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarImg}>
        <img src={logo} alt="Logo da empresa Marmite-se" />
      </div>

      <p>{dateNow}</p>
      {user ?  <Button text="Sair" onClick={logout} Icon={FaDoorClosed} /> : <ButtonLink text="LOGIN" to="./login" Icon={FaDoorOpen} /> }
     
    </div>
  );
};

export default Navbar;