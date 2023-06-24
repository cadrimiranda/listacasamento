import Image from "next/image";
import styles from "./styles.module.css";
import queries from "@/src/query";
import { useState } from "react";
import useModal from "@/src/useModal";
import Modal from "../../Modal/Modal";
import { WishListType } from "../WishList";

export type WishListItemType = {
  title: string;
  value: number;
  imageSrc: string;
  qrCode: string;
  id: string;
};

const WishItem = ({
  id,
  title,
  value,
  shouldDelete,
  refreshData,
  onAddQrCode,
}: WishListItemType &
  Pick<WishListType, "shouldDelete" | "onAddQrCode"> & {
    refreshData?: () => void;
  }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [qrCode, setQrCode] = useState("");
  const modal = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await queries.deleteWishItem(id);
    refreshData?.();
  };

  const handleAddQrCode = async () => {
    onAddQrCode?.({ id, imageSrc, qrCode, title, value });
    const topElement = document.getElementById("add_form");
    topElement?.scrollIntoView({ behavior: "smooth" });
  };

  if (qrCode === "") {
    queries
      .getQRCode(id)
      .then((res) => res.json())
      .then(setQrCode);
  }

  if (imageSrc === "") {
    queries
      .getImageSrc(id)
      .then((res) => res.json())
      .then(setImageSrc);
  }

  return (
    <div className={styles.itemPresente}>
      <div className={styles.itemImageHolder}>
        {imageSrc === "" ? (
          <div className="skeleton-placeholder skeleton-wish-image" />
        ) : (
          <Image
            className={styles.giftImage}
            src={imageSrc}
            alt={`presente-${title}`}
            width={100}
            height={100}
          />
        )}
      </div>
      <p className={styles.itemTitulo}>{title}</p>
      <p className={styles.amount}>
        {value.toLocaleString("pt-BR", {
          currency: "BRL",
          style: "currency",
          minimumFractionDigits: 2,
        })}
      </p>

      {shouldDelete ? (
        <>
          <button
            disabled={isDeleting}
            onClick={handleDelete}
            className={styles.buyButton}
          >
            Delete
          </button>
          <button
            disabled={isDeleting}
            onClick={handleAddQrCode}
            className={styles.buyButton}
          >
            QR Code
          </button>
        </>
      ) : (
        <button onClick={modal.openModal} className={styles.buyButton}>
          Presentear
        </button>
      )}
      <Modal onClose={modal.closeModal} isOpen={modal.isOpen} />
    </div>
  );
};

export default WishItem;
