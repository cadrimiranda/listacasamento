"use client";
import { useEffect, useState } from "react";
import WishItem, { WishItemType } from "./WishItem";
import styles from "../app/page.module.css";
import queries from "@/src/query";

const WishList = ({ shouldDelete }: { shouldDelete?: boolean }) => {
  const [itens, setItens] = useState<WishItemType[]>([]);

  const getData = () => {
    queries.queryAllWishItems().then((res) => {
      setItens(res);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.listaPresentes}>
      {itens.map((props) => (
        <WishItem
          refreshData={getData}
          shouldDelete={shouldDelete}
          key={props.title}
          {...props}
        />
      ))}
    </div>
  );
};

export default WishList;
