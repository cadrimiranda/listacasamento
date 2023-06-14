import styles from "./page.module.css";
import Header from "@/components/Header/Header";
import WishList from "@/components/WishList/WishList";

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <h1 className={styles.title}>Lista de presentes</h1>
      <WishList />
    </main>
  );
}
