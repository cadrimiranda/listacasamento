import React from "react";
import styles from "./styles.module.css";

interface ModalState {
  isOpen: boolean;
  onClose: () => void;
  onLoading?: boolean;
  children?: any;
}

const Modal = ({ isOpen, onClose, children, onLoading }: ModalState) => {
  const handleOnClose = () => {
    if (!onLoading) {
      onClose();
    }
  };

  return (
    isOpen && (
      <div
        onClick={handleOnClose}
        className={`${styles.modal} ${isOpen ? styles.open : ""}`}
      >
        <div className={styles.modalContent}>
          <span className={styles.close} onClick={handleOnClose}>
            &times;
          </span>
          {children}
        </div>
        <div className={styles.overlay} onClick={handleOnClose} />
      </div>
    )
  );
};

export default Modal;
