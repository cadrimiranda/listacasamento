import styles from "./page.module.css";
import Header from "@/components/Header/Header";
import WishList from "@/components/WishList/WishList";
import Head from "next/head";

export default function Home() {
  return (
    <main className={styles.main}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </Head>
      <Header />
      <h1 className={styles.title}>Lista de presentes</h1>
      <WishList />
    </main>
  );
}
