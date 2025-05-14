import React from "react";
import styles from "./custom-button.module.css";

type CustomButtonProps = {
  text: string,
  disabled: boolean,
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const CustomButtonComponent: React.FC<CustomButtonProps> = ({
  text,
  onClick,
  disabled
}) => {
  return (
    <button disabled={disabled} onClick={onClick} className={styles.buttonWrapper}>
      {text}
    </button>
  );
};

export default CustomButtonComponent;
