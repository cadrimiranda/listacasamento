import { WishItemType } from "@/components/WishItem";

const queries = {
  queryAllWishItems: (): Promise<WishItemType[]> => {
    return fetch(
      `${process.env.NEXT_PUBLIC_FETCH_URL}/api/wishlist/getall`
    ).then((res) => res.json());
  },
  addWishItem: (body: Omit<WishItemType, "value"> & { value: string }) => {
    return fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/api/wishlist/add`, {
      method: "POST",
      body: JSON.stringify({
        ...body,
        value: Number(body.value),
      }),
    });
  },
  deleteWishItem: (name: string) => {
    return fetch(
      `${process.env.NEXT_PUBLIC_FETCH_URL}/api/wishlist/delete?name=${name}`,
      {
        method: "DELETE",
      }
    );
  },
};

export default queries;
