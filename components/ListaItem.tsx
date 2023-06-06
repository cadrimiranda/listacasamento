import Image, { StaticImageData } from "next/image";
import styles from "./ListaItem.module.css";

const ListaItem = ({
  title,
  value,
  imageSrc,
}: {
  title: string;
  value: number;
  imageSrc: StaticImageData;
}) => {
  return (
    <div className={styles.itemPresente}>
      <div className={styles.itemImageHolder}>
        <Image
          className={styles.giftImage}
          src={imageSrc}
          alt={`presente-${title}`}
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
      <button className={styles.buyButton}>Comprar</button>
    </div>
  );
};

export default ListaItem;
