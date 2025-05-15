import React from "react";
import styles from "./register-or-login-link.module.css";

type RegisterOrLoginLinkProps = {
  text: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const RegisterOrLoginLinkComponent: React.FC<RegisterOrLoginLinkProps> = ({
  text,
  onClick,
}) => {
  return (
    <button onClick={onClick} className={styles.mainStyle}>
      {text}
    </button>
  );
};

export default RegisterOrLoginLinkComponent;
