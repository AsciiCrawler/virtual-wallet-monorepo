import React from "react";
import styles from "./home-toolbar.module.css";
import depositImage from "@/assets/deposit.svg";
import payImage from "@/assets/pay.svg";

type HomeToolbarProps = {
  onDepositClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onTransferClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const HomeToolbarComponent: React.FC<HomeToolbarProps> = ({
  onDepositClick,
  onTransferClick,
}) => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.subContainer}>
        <button onClick={onDepositClick} className={styles.item}>
          <img src={depositImage.src} className={styles.itemIcon} alt="Depositar" />
          <span className={styles.itemText}>Depositar</span>
        </button>
        <button onClick={onTransferClick} className={styles.item}>
          <img src={payImage.src} className={styles.itemIcon} alt="Transferir o pagar" />
          <span className={styles.itemText}>Transferir o pagar</span>
        </button>
      </div>
    </div>
  );
};

export default HomeToolbarComponent;
