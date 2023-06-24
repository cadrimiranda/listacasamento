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
  qrCodeLink: string;
  id: string;
};

const WishItem = ({
  id,
  title,
  value,
  shouldDelete,
  refreshData,
  onAddQrCode,
  removeItem,
}: WishListItemType &
  Pick<WishListType, "shouldDelete" | "onAddQrCode"> & {
    refreshData?: () => void;
    removeItem: (id: string) => void;
  }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [qrCode, setQrCode] = useState<{ image: ""; link: "" } | null>(null);
  const modal = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await queries.deleteWishItem(id);
    removeItem(id);
  };

  const handleAddQrCode = async () => {
    onAddQrCode?.({
      id,
      imageSrc: imageSrc || "",
      qrCode: qrCode?.image || "",
      qrCodeLink: qrCode?.link || "",
      title,
      value,
    });
    const topElement = document.getElementById("add_form");
    topElement?.scrollIntoView({ behavior: "smooth" });
  };

  if (qrCode === null) {
    queries
      .getQRCode(id)
      .then((res) => res.json())
      .then((code) => code && setQrCode(code));
  }

  if (imageSrc === null) {
    queries
      .getImageSrc(id)
      .then((res) => res.json())
      .then((img) =>  img && setImageSrc(img));
  }

  return (
    <div className={styles.itemPresente}>
      <div className={styles.itemImageHolder}>
        {imageSrc === "" ? (
          <div className="skeleton-placeholder skeleton-wish-image" />
        ) : (
          <Image
            className={styles.giftImage}
            src={imageSrc || ""}
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
            Editar
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
