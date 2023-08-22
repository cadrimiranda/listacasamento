import { WishListItemType } from "@/components/WishList/item/WishListItem";
import { WishListLog } from "./schemas";

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
  getQRCode: (id: string) => {
    return fetch(`/api/wishlist/qrCode?id=${id}`, {
      method: "POST",
    });
  },
  log: (log: WishListLog) => {
    if (process.env.NODE_ENV === "production") {
      return fetch(`/api/wishlist/log`, {
        method: "POST",
        body: JSON.stringify(log),
      });
    }
  },
  getDashboard: () => {
    return fetch(`/api/wishlist/dashboard`);
  },
};

export default queries;
