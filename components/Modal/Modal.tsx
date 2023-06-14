import React from "react";
import styles from "./styles.module.css";
import wishListStyles from "./WishItem.module.css";
import { WishListItemType } from "../WishList/item/WishListItem";
import Image from "next/image";

interface ModalState {
  isOpen: boolean;
  onClose: () => void;
  qrCode: WishListItemType["qrCode"];
}

const Modal = ({ isOpen, onClose, qrCode }: ModalState) => {
  return (
    isOpen && (
      <div
        onClick={onClose}
        className={`${styles.modal} ${isOpen ? styles.open : ""}`}
      >
        <div className={styles.modalContent}>
          <span className={styles.close} onClick={onClose}>
            &times;
          </span>
          <Image
            className={wishListStyles.giftImage}
            src={qrCode}
            alt={`qrCode`}
            width={100}
            height={100}
          />
        </div>
        <div className={styles.overlay} onClick={onClose} />
      </div>
    )
  );
};

export default Modal;
