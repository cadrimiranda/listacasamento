import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import styles from "./styles.module.css";

interface ModalState {
  onClose?: () => void;
  children?: any;
}

export type ModalHandler = {
  openModal: () => void;
  isModalOpened: boolean;
  handleOnClose: () => void;
  closeModal: () => void;
};

const Modal = forwardRef<ModalHandler, ModalState>(
  ({ children, onClose }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const closeModal = useCallback(() => {
      setIsOpen(false);
    }, [setIsOpen]);

    const handleOnClose = useCallback(() => {
      closeModal();
      onClose?.();
    }, [closeModal, onClose]);

    useImperativeHandle(
      ref,
      () => ({
        openModal: () => setIsOpen(true),
        handleOnClose,
        closeModal,
        isModalOpened: isOpen,
      }),
      [handleOnClose, closeModal, isOpen, setIsOpen]
    );

    return (
      isOpen && (
        <div className={`${styles.modal} ${isOpen ? styles.open : ""}`}>
          <div className={styles.overlay} onClick={handleOnClose} />
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={handleOnClose}>
              &times;
            </span>
            {children}
          </div>
        </div>
      )
    );
  }
);

Modal.displayName = "WishList";

export default Modal;
