"use client";
import {
  Suspense,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import WishListItem, { WishListItemType } from "./item/WishListItem";
import styles from "./styles.module.css";
import queries from "@/src/query";

export type WishListRef = {
  getData: () => void;
};

export type WishListType = {
  shouldDelete?: boolean;
};

const WishList = forwardRef<WishListRef, WishListType>(
  ({ shouldDelete }, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const [itens, setItens] = useState<WishListItemType[]>([]);

    const getData = useCallback(() => {
      setIsLoading(true);
      queries.queryAllWishItems().then((res) => {
        setItens(res);
        setIsLoading(false);
      });
    }, [setItens]);

    useImperativeHandle(
      ref,
      () => ({
        getData,
      }),
      [getData]
    );

    useEffect(() => {
      getData();
    }, []);

    return (
      <Suspense>
        <div className={styles.listaPresentes}>
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((value) => (
                <div
                  key={value}
                  className="skeleton-placeholder skeleton-wish-item"
                />
              ))}
            </>
          ) : (
            itens.map((props) => (
              <WishListItem
                refreshData={getData}
                shouldDelete={shouldDelete}
                key={props.title}
                {...props}
              />
            ))
          )}
        </div>
      </Suspense>
    );
  }
);

WishList.displayName = "WishList";

export default WishList;
