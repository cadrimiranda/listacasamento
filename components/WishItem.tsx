import Image from "next/image";
import styles from "./WishItem.module.css";
import queries from "@/src/query";
import { useState } from "react";

export type WishItemType = {
  title: string;
  value: number;
  imageSrc: string;
};

const WishItem = ({
  title,
  value,
  imageSrc,
  shouldDelete,
  refreshData,
}: WishItemType & {
  shouldDelete?: boolean;
  refreshData?: () => void;
}) => {
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
        <button className={styles.buyButton}>Comprar</button>
      )}
    </div>
  );
};

export default WishItem;
