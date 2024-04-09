import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import Button from "../../components/Button/Button";
import { FaAngleRight, FaCog, FaSearch } from "react-icons/fa";
import ButtonLink from "../Link/ButtonLink";

const Sidebar = () => {
  const [config, setConfig] = useState(false);
  const [search, setSearch] = useState(false);

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
      <div className={styles.buttons}>
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
      </div>

      <div className={styles.main}></div>
    </div>
  );
};

export default Sidebar;
