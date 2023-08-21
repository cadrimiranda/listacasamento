import Image from "next/image";
import styles from "./styles.module.css";
import queries from "@/src/query";
import { useRef, useState } from "react";
import { WishListType } from "../WishList";
import { useIsInViewport } from "./useIsInViewport";
import { LogType } from "@/src/schemas";

export type WishListItemType = {
  title: string;
  value: number;
  imageSrc: string;
  qrCode: string;
  qrCodeLink: string;
  id: string;
};

export type QrCodeData = { image: ""; link: "" };

export const toBRLValue = (value: number) =>
  value.toLocaleString("pt-BR", {
    currency: "BRL",
    style: "currency",
    minimumFractionDigits: 2,
  });

const WishItem = ({
  id,
  title,
  value,
  shouldDelete,
  onAddQrCode,
  removeItem,
  onGift,
}: WishListItemType &
  Pick<WishListType, "shouldDelete" | "onAddQrCode"> & {
    onGift?: (id: string, image: string, qrCode: QrCodeData) => void;
    removeItem: (id: string) => void;
  }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [qrCode, setQrCode] = useState<QrCodeData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isInViewPort = useIsInViewport(ref);
  const [alreadyLogged, setLogged] = useState(false);
  if (isInViewPort && !alreadyLogged) {
    queries.log({ logType: LogType.seen, document: title });
    setLogged(true);
  }

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
      .then((img) => img && setImageSrc(img));
  }

  return (
    <div ref={ref} className={styles.itemPresente}>
      <div className={styles.itemImageHolder}>
        {imageSrc === null ? (
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
      <p className={styles.amount}>{toBRLValue(value)}</p>

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
        <button
          onClick={() => onGift?.(id, imageSrc || "", qrCode as QrCodeData)}
          className={styles.buyButton}
        >
          Presentear
        </button>
      )}
    </div>
  );
};

export default WishItem;
