import WishList, { WishListRef } from "@/components/WishList/WishList";
import queries from "@/src/query";
import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import styles from "../page.module.css";
import SubmitButton from "./SubmitButton";
import InputWithLabel from "@/components/InputWithLabel/InputWithLabel";
import { WishListItemType } from "@/components/WishList/item/WishListItem";
import Image from "next/image";

export const WishListAddForm = () => {
  const [itemToUpdate, setItem] = useState<WishListItemType | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const refWishList = useRef<WishListRef>(null);
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

  const fillInputs = (item: WishListItemType) => {
    setTitle(item.title);
    setValue(item.value.toString());
    setImageSrc(item.imageSrc);
    setQrCode(item.qrCode);
  };

  const clearInputs =
    (shouldUpdate = true) =>
    () => {
      setTitle("");
      setValue("");
      setImageSrc("");
      setQrCode("");

      if (refImage.current) {
        refImage.current.value = "";
      }

      if (refQRCode.current) {
        refQRCode.current.value = "";
      }

      if (refWishList.current && shouldUpdate) {
        refWishList.current.getData();
      }

      if (itemToUpdate) {
        setItem(null);
      }

      setIsLoading(false);
    };

  const handleSubmit = (evt?: FormEvent<HTMLFormElement>) => {
    evt?.preventDefault();
    setIsLoading(true);

    const item: Omit<WishListItemType, "id" | "value"> & {
      id?: string;
      value: string;
    } = {
      title,
      value,
      imageSrc,
      qrCode,
    };

    if (itemToUpdate) {
      item.id = itemToUpdate.id;
    }
    queries.addWishItem(item).then(clearInputs());
  };

  const handleEdit = (item: WishListItemType) => {
    setItem(item);
    fillInputs(item);
  };

  return (
    <div>
      <form className={styles.formContainer} onSubmit={handleSubmit} id="add_form">
        <InputWithLabel
          disabled={isLoading}
          id="title"
          label="Title"
          onChange={handleInput(setTitle)}
          value={title}
        />
        <InputWithLabel
          disabled={isLoading}
          onChange={handleInput(setValue)}
          label="Value"
          type="number"
          id="value"
          value={value}
        />
        <div
          style={{
            width: "49%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <InputWithLabel
            disabled={isLoading}
            onChange={handleFile(setImageSrc)}
            label="Image"
            type="file"
            id="image"
            ref={refImage}
          />
          <Image src={imageSrc} height={100} width={100} alt="image" />
        </div>
        <div
          style={{
            width: "49%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <InputWithLabel
            disabled={isLoading}
            onChange={handleFile(setQrCode)}
            label="QR Code"
            type="file"
            id="qrCode"
            ref={refQRCode}
          />
          <Image src={qrCode} height={100} width={100} alt="qr code" />
        </div>

        <SubmitButton isLoading={isLoading} />
        <SubmitButton
          isLoading={isLoading}
          title="Limpar"
          onClick={clearInputs(false)}
        />
      </form>
      <WishList ref={refWishList} shouldDelete onAddQrCode={handleEdit} />
    </div>
  );
};
