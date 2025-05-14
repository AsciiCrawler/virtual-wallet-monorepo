import React from "react";
import styles from "./custom-input.module.css";

type CustomInputProps = {
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CustomInputComponent: React.FC<CustomInputProps> = ({
  placeholder: label,
  type,
  value,
  onChange,
}) => {
  return (
    <div className={styles.inputWrapper}>
      <input
        className={styles.styledInput}
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default CustomInputComponent;
