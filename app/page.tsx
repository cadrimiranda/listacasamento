import styles from "./page.module.css";
import Header from "@/components/Header/Header";
import WishList from "@/components/WishList/WishList";
import Head from "next/head";

export default function Home() {
  return (
    <main className={styles.main}>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />
      </Head>
      <Header />
      <h1 className={styles.title}>Lista de presentes</h1>
      <WishList />
    </main>
  );
}
