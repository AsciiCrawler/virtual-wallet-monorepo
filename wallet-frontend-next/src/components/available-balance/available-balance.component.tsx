import React from "react";
import styles from "./available-balance.module.css";

type AvailableBalanceProps = {
  text: string;
};

const AvailableBalanceComponent: React.FC<AvailableBalanceProps> = ({
  text,
}) => {
  return (
    <div className={styles.mainContainer}>
      <span className={styles.balanceText}>{text}</span>
      <span className={styles.balanceTitle}>Saldo disponible</span>
    </div>
  );
};

export default AvailableBalanceComponent;
