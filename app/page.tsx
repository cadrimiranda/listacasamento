import ListaItem from "@/components/ListaItem";
import styles from "./page.module.css";
import Header from "@/components/Header";

import ImgEuro from "@/public/euro.png";
import ImgChampagne from "@/public/champagne.png";
import ImgAssento from "@/public/assento.jpg";
import ImgWhey from "@/public/wehey.png";
import ImgJantar from "@/public/jantar.jpg";
import ImgPasseio from "@/public/passeioportugal.png";

const itens = [
  {
    title: "Euro para viagem",
    value: 200,
    imageSrc: ImgEuro,
  },
  {
    title: "Champagne para a noite de núpcias",
    value: 200,
    imageSrc: ImgChampagne,
  },
  {
    title: "Upgrade de assento na lua de mel",
    value: 200,
    imageSrc: ImgAssento,
  },
  {
    title: "Whey para manter o shape pós festa",
    value: 200,
    imageSrc: ImgWhey,
  },
  {
    title: "Jantar romântico em Porto",
    value: 200,
    imageSrc: ImgJantar,
  },
  {
    title: "Passeio em Portugal",
    value: 150.55,
    imageSrc: ImgPasseio,
  },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <h1 className={styles.title}>Lista de presentes</h1>
      <div className={styles.listaPresentes}>
        {itens.map((props) => (
          <ListaItem key={props.title} {...props} />
        ))}
      </div>
    </main>
  );
}
