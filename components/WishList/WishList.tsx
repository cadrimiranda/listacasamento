"use client";
import {
  Suspense,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import WishListItem, {
  QrCodeData,
  WishListItemType,
} from "./item/WishListItem";
import styles from "./styles.module.css";
import queries from "@/src/query";
import { SearchInput } from "./SearchInput/SearchInput";
import FilterButton from "./FilterButton/FilterButton";
import Modal from "../Modal/Modal";
import { useDataHandler } from "@/src/usaDataHandler";
import useModalHandler from "@/src/useModalHandler";
import { GiftItem } from "./giftItem/giftItem";

export type WishListRef = {
  getData: () => void;
};

export type WishListType = {
  shouldDelete?: boolean;
  onAddQrCode?: (item: WishListItemType) => void;
};

const WishList = forwardRef<WishListRef, WishListType>(
  ({ shouldDelete, onAddQrCode }, ref) => {
    const {
      data,
      setItens,
      setFilter,
      selectedItem,
      setSuggestion,
      handleRemoveItem,
      handleSelectItem,
      autocompleteSuggestions,
      handleClearSuggestions,
    } = useDataHandler();
    const [isLoading, setIsLoading] = useState(false);
    const refModal = useModalHandler();

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
    }, [getData]);

    const onGift = (id: string, image: string, qrCode: QrCodeData) => {
      handleSelectItem(id, image, qrCode);
      refModal.openModal();
    };

    return (
      <Suspense>
        <div className={styles.filterWrapper}>
          <SearchInput
            label="Procure por um item"
            suggestions={autocompleteSuggestions}
            disabled={isLoading}
            onSuggestionSelect={setSuggestion}
            onSuggestionClear={handleClearSuggestions}
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
            data.map((props) => (
              <WishListItem
                shouldDelete={shouldDelete}
                key={props.title}
                onAddQrCode={onAddQrCode}
                removeItem={handleRemoveItem}
                onGift={onGift}
                {...props}
              />
            ))
          )}
        </div>
        <Modal ref={refModal.ref}>
          {selectedItem && <GiftItem item={selectedItem} />}
        </Modal>
      </Suspense>
    );
  }
);

WishList.displayName = "WishList";

export default WishList;
