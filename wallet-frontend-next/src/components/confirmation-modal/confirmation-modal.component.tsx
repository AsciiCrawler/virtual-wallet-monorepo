import React, { useEffect, useState } from "react";
import styles from "./confirmation-modal.module.css";

interface ConfirmationModalProps {
  buttonText: string;
  onCloseClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onButtonClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setConfirmationCode: (code: string) => void;
}

const ConfirmationModalComponent: React.FC<ConfirmationModalProps> = ({
  buttonText,
  onButtonClick,
  onCloseClick,
  setConfirmationCode,
}) => {
  const [code, setCode] = useState<string>("------");

  const handleKeyPress = (value: string) => {
    if (value === "⌫") {
      setCode((prev) =>
        prev
          .split("")
          .filter((char) => char != "-")
          .join("")
          .slice(0, -1)
          .padEnd(6, "-")
      );
    } else if (/^\d$/.test(value)) {
      setCode((prev) => {
        if (prev.split("").filter((char) => char != "-").length >= 6)
          return prev;

        return (
          prev
            .split("")
            .filter((char) => char != "-")
            .join("") + value
        ).padEnd(6, "-");
      });
    }
  };

  useEffect(() => {
    setConfirmationCode(code);
  }, [code]);

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

  return (
    <div onClick={onCloseClick} className={styles.container}>
      <div onClick={(e) => e.stopPropagation()} className={styles.subContainer}>
        <div className={styles.amountDisplay}>
          {code.split("").map((char, index) => {
            return (
              <span key={index} className={styles.codeChar}>
                {char}
              </span>
            );
          })}
        </div>
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

export default ConfirmationModalComponent;
