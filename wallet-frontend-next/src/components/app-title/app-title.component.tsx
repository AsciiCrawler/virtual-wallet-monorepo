import React, { Fragment } from "react";
import styles from "./app-title.module.css";

const AppTitleComponent: React.FC = () => {
  return (
    <Fragment>
      <span className={styles.title}>VIRTUAL</span>
      <span className={styles.title}>WALLET</span>
    </Fragment>
  );
};

export default AppTitleComponent;
