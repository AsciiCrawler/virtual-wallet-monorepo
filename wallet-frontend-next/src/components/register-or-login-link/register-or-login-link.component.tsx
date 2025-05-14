import React from "react";
import styles from "./register-or-login-link.module.css";
import Link from "next/link";

type RegisterOrLoginLinkProps = {
  text: string;
  route: string;
};

const RegisterOrLoginLinkComponent: React.FC<RegisterOrLoginLinkProps> = ({
  text,
  route,
}) => {
  return (
    <Link className={styles.mainStyle} href={route}>
      {text}
    </Link>
  );
};

export default RegisterOrLoginLinkComponent;
