"use client";
import WishList from "@/components/WishList";
import queries from "@/src/query";
import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import InputWithLabel from "./InputWithLabel";
import styles from "./page.module.css";

const AddForm = () => {
  const refImage = useRef<HTMLInputElement>(null);
  const refQRCode = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [qrCode, setQrCode] = useState("");

  const handleFile =
    (setImage: Function) => (evt: React.ChangeEvent<HTMLInputElement>) => {
      const file = evt.target.files?.[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = (event) => {
          const base64String = event.target?.result as string;
          setImage(base64String);
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
        qrCode,
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
    <div>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <InputWithLabel
          id="title"
          label="Title"
          onChange={handleInput(setTitle)}
          value={title}
        />
        <InputWithLabel
          onChange={handleInput(setValue)}
          label="Value"
          type="number"
          id="value"
          value={value}
        />
        <InputWithLabel
          onChange={handleFile(setImageSrc)}
          label="Image"
          type="file"
          id="image"
          ref={refImage}
        />
        <InputWithLabel
          onChange={handleFile(setQrCode)}
          label="QR Code"
          type="file"
          id="qrCode"
          ref={refQRCode}
        />
        <button className={styles.submitButton} type="submit">
          Submit
        </button>
      </form>
      <div>
        <WishList shouldDelete />
      </div>
    </div>
  );
};

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
    <AddForm />
  ) : (
    <form onSubmit={handleSubmit}>
      <input ref={ref} type="password" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default PrivateWishListAdd;
