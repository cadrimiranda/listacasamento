"use client";
import {
  Suspense,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import WishItem, { WishItemType } from "./WishItem";
import styles from "../app/page.module.css";
import wishItemStyle from "./WishItem.module.css";
import queries from "@/src/query";

export type WishListRef = {
  getData: () => void;
};

const WishList = forwardRef<WishListRef, { shouldDelete?: boolean }>(
  ({ shouldDelete }, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const [itens, setItens] = useState<WishItemType[]>([]);

    const getData = useCallback(() => {
      setIsLoading(true);
      queries.queryAllWishItems().then((res) => {
        setItens(res);
        setIsLoading(false);
      });
    }, [setItens]);

    useImperativeHandle(
      ref,
      () => {
        return {
          getData,
        };
      },
      [getData]
    );

    useEffect(() => {
      getData();
    }, []);

    return (
      <Suspense>
        <div className={styles.listaPresentes}>
          {isLoading && (
            <>
              {[1, 2, 3, 4].map((value) => (
                <div key={value} className={styles.skeletonBox} />
              ))}
            </>
          )}
          {itens.map((props) => (
            <WishItem
              refreshData={getData}
              shouldDelete={shouldDelete}
              key={props.title}
              {...props}
            />
          ))}
        </div>
      </Suspense>
    );
  }
);

WishList.displayName = "WishList";

export default WishList;
