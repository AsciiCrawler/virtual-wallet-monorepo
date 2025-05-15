import React from "react";
import styles from "./credit-card.module.css";

const CreditCardComponent: React.FC = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.cardNumbersContainer}>
        <div className={styles.cardNumberLabel}>Número de tarjeta</div>
        <div className={styles.cardNumber}>**** **** **** 1234</div>
      </div>

      <div className={styles.cardDetailsContainer}>
        <div className={styles.validBox}>
          <div className={styles.label}>Expiración</div>
          <div className={styles.value}>10/28</div>
        </div>
        <div className={styles.cvvBox}>
          <div className={styles.label}>CVV</div>
          <div className={styles.value}>123</div>
        </div>
        <div className={styles.logo}>
          <div className={styles.circleRed}></div>
          <div className={styles.circleYellow}></div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardComponent;
