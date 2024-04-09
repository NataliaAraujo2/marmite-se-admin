import { useAuthValue } from "../../context/AuthContext";
import logo from "../../images/logo-removebg.png";
import styles from "./Home.module.css";

const Home = () => {
  const { user } = useAuthValue();

  return (
    <div className={styles.home}>
      {user ? (
        <div className={styles.main}>
          <div className={styles.userDetails}>
            <span>Bem Vindo(a) {user.displayName}</span>
          </div>
          <div className={styles.img}>
            <img src={logo} alt="Logo da empresa" />
          </div>
        </div>
      ) : (
        <div className={styles.img}>
          <img src={logo} alt="Logo da empresa" />
        </div>
      )}
    </div>
  );
};

export default Home;
