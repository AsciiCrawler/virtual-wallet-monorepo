import React, { useEffect, useState } from "react";
import styles from "./transfer-modal.module.css";
import { useGlobalStore } from "@/app/zustand";

interface TransferModalProps {
  buttonText: string;
  onCloseClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onButtonClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setAmount: (amount: number) => void;
}

export const formatTransferNumber = (digits: string): string => {
  const padded = digits.padStart(8, "0"); // ensure 4 digits
  const dollars = padded.slice(0, -2);
  const cents = padded.slice(-2);
  return `${parseInt(dollars, 10)}.${cents}`;
};

const TransferModalComponent: React.FC<TransferModalProps> = ({
  buttonText,
  onButtonClick,
  onCloseClick,
  setAmount,
}) => {
  const globalStore = useGlobalStore();
  const [amountDigits, setAmountDigits] = useState<string>("00000000");

  const handleKeyPress = (value: string) => {
    if (value === "⌫") {
      setAmountDigits((prev) => prev.slice(0, -1).padStart(8, "0"));
    } else if (/^\d$/.test(value)) {
      setAmountDigits((prev) => {
        if (prev[0] != "0") return prev;
        const newDigits = (prev + value).slice(-8);
        return newDigits;
      });
    }
  };

  useEffect(() => {
    setAmount(Number(formatTransferNumber(amountDigits)));
  }, [amountDigits]);

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

  return (
    <div onClick={onCloseClick} className={styles.container}>
      <div onClick={(e) => e.stopPropagation()} className={styles.subContainer}>
        <div className={styles.amountDisplay}>
          <span className={styles.dollarSign}>$</span>
          <input
            type="text"
            className={styles.amountInput}
            value={formatTransferNumber(amountDigits)}
            readOnly
          />
        </div>
        <p className={styles.balance}>
          Tu saldo: ${globalStore.balance.toFixed(2)} (disponible)
        </p>
        <div className={styles.keypad}>
          {keys.map((key) => (
            <button
              key={key}
              className={styles.key}
              onClick={() => handleKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>
        <button onClick={onButtonClick} className={styles.transferButton}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default TransferModalComponent;
