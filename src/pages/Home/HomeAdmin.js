import styles from "./Home.module.css";
import logo from "../../images/logo-removebg.png";
import { useEffect, useState } from "react";
import { useAuthValue } from "../../context/AuthContext";
import { useQueries } from "../../services/Documents/useQueries";

const HomeAdmin = () => {
  const { user } = useAuthValue();
  const [userName, setUserName] = useState("");
  //deal with memory leak
  const [cancelled, setCancelled] = useState(false);
  //const filter users
  const { filter: filterUsers, document: filteredUser } = useQueries("users");

  useEffect(() => {
    if (cancelled) return;

    async function loadUser() {
      if (user) {
        setUserName(user.displayName);
        const uid = user.uid;
        const field = "uid";
        const demand = uid;
        await filterUsers(field, demand);
      }
    }

    loadUser();

    return () => {
      setCancelled(true);
    };
  }, [cancelled, filterUsers, user]);

  return (
    <div className={styles.home}>
      {!filteredUser && <p>Carregando....</p>}
      {filteredUser.authUser === "admin" && (
        <div className={styles.main}>
          <div className={styles.userDetails}>Bem Vindo {userName}</div>
          <div className={styles.img}>
            <img src={logo} alt="Logo da empresa" />
          </div>
        </div>
      )}
      {filteredUser.authUser === "user" && (
        <div className={styles.main}>
          <div className={styles.userDetails}>
            <p>USUÁRIO NÃO AUTORIZADO!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeAdmin;
