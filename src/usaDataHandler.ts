import { FilterOptions } from "@/components/WishList/FilterButton/FilterButton";
import {
  QrCodeData,
  WishListItemType,
} from "@/components/WishList/item/WishListItem";
import { useMemo, useState } from "react";

export const useDataHandler = () => {
  const [itens, setItens] = useState<WishListItemType[]>([]);
  const [filter, setFilter] = useState<FilterOptions | null>(null);
  const [sugestion, setSuggestion] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<WishListItemType | null>(
    null
  );

  const dataToDisplay = useMemo(() => {
    let renderItens = itens;

    if (sugestion) {
      renderItens = itens.filter((x) => x.title === sugestion);
    }

    if (filter) {
      switch (filter) {
        case FilterOptions.AscByTitle:
          return renderItens.sort((a, b) => a.title.localeCompare(b.title));
        case FilterOptions.DescByTitle:
          return renderItens.sort((a, b) => b.title.localeCompare(a.title));
        case FilterOptions.AscByPrice:
          return renderItens.sort((a, b) => a.value - b.value);
        case FilterOptions.DescByPrice:
          return renderItens.sort((a, b) => b.value - a.value);
        default:
          return renderItens;
      }
    }

    return renderItens;
  }, [itens, sugestion, filter]);

  const autocompleteSuggestions = useMemo(
    () => itens.map((x) => x.title),
    [itens]
  );

  const handleClearSuggestions = () => {
    if (sugestion) {
      setSuggestion(null);
    }
  };

  const handleRemoveItem = (id: string) =>
    setItens(itens.filter((x) => x.id !== id));

  const handleSelectItem = (id: string, image: string, qrCode: QrCodeData) => {
    let _item =
      dataToDisplay.find((x) => x.id === id) || ({} as WishListItemType);

    setSelectedItem({
      ..._item,
      imageSrc: image,
      qrCode: qrCode.image,
      qrCodeLink: qrCode.link,
    });
  };

  return {
    data: dataToDisplay,
    autocompleteSuggestions,
    handleClearSuggestions,
    handleRemoveItem,
    setItens,
    setFilter,
    setSuggestion,
    selectedItem,
    handleSelectItem,
  };
};
