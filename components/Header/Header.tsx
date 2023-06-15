import styles from "./styles.module.css";
import Image from "next/image";
import CoverImage from "@/public/cover.jpeg";

const Header = () => {
  const today = new Date();
  const marriageDay = new Date("2023-11-12");

  const diff = marriageDay.getTime() - today.getTime();
  const daysMissing = (diff / (1000 * 60 * 60 * 24)).toFixed(0);

  return (
    <div className={styles.header}>
      <h1 className={styles.headerTitle}>Débora e Carlos</h1>
      <div className={styles.divider} />
      <h2
        className={styles.headerSubTitle}
      >{`12 de novembro de 2023 - Faltam ${daysMissing} dias`}</h2>
      <Image className={styles.headerCover} src={CoverImage} alt="header" priority />
    </div>
  );
};

export default Header;
