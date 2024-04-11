
import logo from "../../images/logo-removebg.png";
import styles from "./Home.module.css";

const Home = () => {
 

  return (
    <div className={styles.home}>
      <div className={styles.main}>
        <div className={styles.img}>
          <img src={logo} alt="Logo da empresa" />
        </div>
      </div>
    </div>
  );
};

export default Home;
