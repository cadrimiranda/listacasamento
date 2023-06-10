import Image from "next/image";
import styles from "./WishItem.module.css";
import queries from "@/src/query";
import { useState } from "react";
import useModal from "@/src/useModal";
import Modal from "./Modal";

export type WishItemType = {
  title: string;
  value: number;
  imageSrc: string;
  qrCode: string;
};

const WishItem = ({
  title,
  value,
  imageSrc,
  shouldDelete,
  refreshData,
  qrCode,
}: WishItemType & {
  shouldDelete?: boolean;
  refreshData?: () => void;
}) => {
  
  const modal = useModal();
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    setIsDeleting(true);
    await queries.deleteWishItem(title);
    refreshData?.();
  };

  return (
    <div className={styles.itemPresente}>
      <div className={styles.itemImageHolder}>
        <Image
          className={styles.giftImage}
          src={imageSrc}
          alt={`presente-${title}`}
          width={100}
          height={100}
        />
      </div>
      <p className={styles.itemTitulo}>{title}</p>
      <div className={styles.divider} />
      <p>
        {value.toLocaleString("pt-BR", {
          currency: "BRL",
          style: "currency",
          minimumFractionDigits: 2,
        })}
      </p>

      {shouldDelete ? (
        <button
          disabled={isDeleting}
          onClick={handleDelete}
          className={styles.buyButton}
        >
          Delete
        </button>
      ) : (
        <button onClick={modal.openModal} className={styles.buyButton}>Comprar</button>
      )}
      <Modal qrCode={qrCode} onClose={modal.closeModal} isOpen={modal.isOpen} />
    </div>
  );
};

export default WishItem;
