import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import Button from "../../components/Button/Button";
import { FaAngleRight, FaCog, FaSearch } from "react-icons/fa";
import ButtonLink from "../Link/ButtonLink";
import { useAuthValue } from "../../context/AuthContext";
import { useQueries } from "../../services/Documents/useQueries";

const Sidebar = () => {
  const [cancelled, setCancelled] = useState(false);
  const {user} =useAuthValue()
  const{filter: filterUsers, document: filteredUser} = useQueries("users")
  const [config, setConfig] = useState(false);
  const [search, setSearch] = useState(false);
  

  useEffect(() => {
    if (cancelled) return;

    async function loadUser() {
      if (user) {
        
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

  const handleModalConfig = (e) => {
    e.preventDefault();

    if (config === false) {
      setConfig(true);
    } else {
      setConfig(false);
    }
  };

  const handleModalSearch = (e) => {
    e.preventDefault();

    if (search === false) {
      setSearch(true);
    } else {
      setSearch(false);
    }
  };
  return (
    <div className={styles.sidebar}>
 {!filteredUser && <p>Carregando...</p>}
 { filteredUser.authUser === "admin" && (     <div className={styles.buttons}>
        <div>
          <Button
            text="CONFIGURAÇÕES"
            Icon={FaCog}
            onClick={handleModalConfig}
          />
          {config && (
            <div className={styles.hide}>
              <ul>
                <ButtonLink to="/branchs" text="SETORES" Icon={FaAngleRight} />
                <ButtonLink
                  to="/products"
                  text="PRODUTOS"
                  Icon={FaAngleRight}
                />
              </ul>
            </div>
          )}
        </div>
        <div>
          <Button
            text="CONSULTAS"
            Icon={FaSearch}
            onClick={handleModalSearch}
          />
          {search && (
            <div className={styles.hide}>
              <ul>
                <ButtonLink
                  to="/customers"
                  text="CLIENTES"
                  Icon={FaAngleRight}
                />
                <ButtonLink to="/orders" text="PEDIDOS" Icon={FaAngleRight} />
              </ul>
            </div>
          )}
        </div>
      </div>)}

      {filteredUser.authUser  === "user" && (<p>Usuário não autorizado!</p>)}

      
    </div>
  );
};

export default Sidebar;
