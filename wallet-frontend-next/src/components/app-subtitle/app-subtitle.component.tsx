import React from "react";
import styles from "./app-subtitle.module.css";

type AppSubtitleProps = {
  text: string;
};

const AppSubtitleComponent: React.FC<AppSubtitleProps> = ({ text }) => {
  return <span className={styles.subtitle}>{text}</span>;
};

export default AppSubtitleComponent;
