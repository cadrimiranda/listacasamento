"use client";
import { FormEvent, useRef, useState } from "react";
import { WishListAddForm } from "./components/WishListAddForm";

const PrivateWishListAdd = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [shouldAdd, setShouldAdd] = useState(true);

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (ref.current?.value === process.env.NEXT_PUBLIC_WISH_LIST_ADD_SECRET) {
      setShouldAdd(true);
    }
  };

  return shouldAdd ? (
    <WishListAddForm />
  ) : (
    <form onSubmit={handleSubmit}>
      <input ref={ref} type="password" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default PrivateWishListAdd;
