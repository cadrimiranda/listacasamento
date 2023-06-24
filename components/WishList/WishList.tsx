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
import { SearchInput } from "./SearchInput/SearchInput";
import FilterButton, { FilterOptions } from "./FilterButton/FilterButton";

export type WishListRef = {
  getData: () => void;
};

export type WishListType = {
  shouldDelete?: boolean;
  onAddQrCode?: (item: WishListItemType) => void;
};

function sortItems(
  items: WishListItemType[],
  filter: FilterOptions
): WishListItemType[] {
  let sortedItems: WishListItemType[];

  switch (filter) {
    case FilterOptions.AscByTitle:
      sortedItems = [...items].sort((a, b) => a.title.localeCompare(b.title));
      break;
    case FilterOptions.DescByTitle:
      sortedItems = [...items].sort((a, b) => b.title.localeCompare(a.title));
      break;
    case FilterOptions.AscByPrice:
      sortedItems = [...items].sort((a, b) => a.value - b.value);
      break;
    case FilterOptions.DescByPrice:
      sortedItems = [...items].sort((a, b) => b.value - a.value);
      break;
    default:
      sortedItems = items;
  }

  return sortedItems;
}

const WishList = forwardRef<WishListRef, WishListType>(
  ({ shouldDelete, onAddQrCode }, ref) => {
    const [filter, setFilter] = useState<FilterOptions | null>(null);
    const [sugestion, setSuggestion] = useState<string | null>(null);
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

    let renderItens = itens;
    if (sugestion) {
      renderItens = itens.filter((x) => x.title === sugestion);
    }

    if (filter) {
      renderItens = sortItems(renderItens, filter);
    }

    return (
      <Suspense>
        <div className={styles.filterWrapper}>
          <SearchInput
            label="Procure por um item"
            suggestions={itens.map((x) => x.title)}
            disabled={isLoading}
            onSuggestionSelect={setSuggestion}
            onSuggestionClear={() => {
              if (sugestion) {
                setSuggestion(null);
              }
            }}
          />
          <FilterButton onFilterSelect={setFilter} />
        </div>
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
            renderItens.map((props) => (
              <WishListItem
                refreshData={getData}
                shouldDelete={shouldDelete}
                key={props.title}
                onAddQrCode={onAddQrCode}
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
