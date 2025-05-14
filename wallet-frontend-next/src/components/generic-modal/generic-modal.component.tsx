import React from "react";
import styles from "./generic-modal.module.css";
import closeIcon from '@/assets/close.svg';

interface GenericModalProps {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
}

const GenericModalComponent: React.FC<GenericModalProps> = ({
  children,
  onClose,
  visible,
}) => {
  if (!visible) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose}>
            <img className={styles.closeButtonImage} src={closeIcon.src} alt="Chevron left" />
          </button>
        </div>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

export default GenericModalComponent;
