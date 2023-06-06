import styles from "./page.module.css";
import Header from "@/components/Header";
import WishList from "@/components/WishList";

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <h1 className={styles.title}>Lista de presentes</h1>
      <WishList />
    </main>
  );
}
