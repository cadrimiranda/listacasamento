import { WishListItemType } from "@/components/WishList/item/WishListItem";

const queries = {
  queryAllWishItems: (): Promise<WishListItemType[]> => {
    return fetch(`/api/wishlist/getall`).then((res) => {
      if (res.status === 200) {
        return res.json();
      }

      throw res.json();
    });
  },
  addWishItem: (
    body: Omit<WishListItemType, "value" | "id"> & { value: string }
  ) => {
    return fetch(`/api/wishlist/add`, {
      method: "POST",
      body: JSON.stringify({
        ...body,
        value: Number(body.value),
      }),
    });
  },
  deleteWishItem: (id: string) => {
    return fetch(`/api/wishlist/delete?id=${id}`, {
      method: "DELETE",
    });
  },
  getImageSrc: (id: string) => {
    return fetch(`/api/wishlist/image?id=${id}`, {
      method: "POST",
    });
  },
};

export default queries;
