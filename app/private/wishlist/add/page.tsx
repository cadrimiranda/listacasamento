"use client";
import WishList from "@/components/WishList";
import queries from "@/src/query";
import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";

const AddForm = () => {
  const refImage = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [imageSrc, setImageSrc] = useState("");

  const handleFile = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setImageSrc(base64String);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleInput =
    (setState: Dispatch<SetStateAction<string>>) =>
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setState(evt.target.value);
    };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    queries
      .addWishItem({
        title,
        value,
        imageSrc,
      })
      .then(() => {
        setTitle("");
        setValue("");
        setImageSrc("");

        if (refImage.current) {
          refImage.current.value = "";
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title:</label>
      <input
        onChange={handleInput(setTitle)}
        type="text"
        id="title"
        name="title"
        value={title}
      />
      <label htmlFor="value">Value:</label>
      <input
        onChange={handleInput(setValue)}
        type="number"
        id="value"
        name="value"
        value={value}
      />
      <label htmlFor="image">Image:</label>
      <input
        ref={refImage}
        onChange={handleFile}
        type="file"
        id="image"
        name="image"
      />
      <button type="submit">Submit</button>
      <div>
        <WishList shouldDelete />
      </div>
    </form>
  );
};

const PrivateWishListAdd = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [shouldAdd, setShouldAdd] = useState(false);

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (ref.current?.value === process.env.NEXT_PUBLIC_WISH_LIST_ADD_SECRET) {
      setShouldAdd(true);
    }
  };

  return shouldAdd ? (
    <AddForm />
  ) : (
    <form onSubmit={handleSubmit}>
      <input ref={ref} type="password" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default PrivateWishListAdd;
