import { WishItemType } from "@/components/WishItem";

const queries = {
  queryAllWishItems: (): Promise<WishItemType[]> => {
    return fetch(
      `/api/wishlist/getall`
    ).then((res) => {
      if (res.status === 200) {

        return res.json();
      }

      throw (res);
    });
  },
  addWishItem: (body: Omit<WishItemType, "value"> & { value: string }) => {
    return fetch(`/api/wishlist/add`, {
      method: "POST",
      body: JSON.stringify({
        ...body,
        value: Number(body.value),
      }),
    });
  },
  deleteWishItem: (name: string) => {
    return fetch(
      `/api/wishlist/delete?name=${name}`,
      {
        method: "DELETE",
      }
    );
  },
};

export default queries;
