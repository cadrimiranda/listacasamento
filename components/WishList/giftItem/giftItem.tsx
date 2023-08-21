import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import { WishListItemType, toBRLValue } from "../item/WishListItem";
import gifItemStyles from "./giftItem.module.css";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { LogType } from "@/src/schemas";
import queries from "@/src/query";

interface IGiftItem {
  item: WishListItemType;
}

const GiftItem = ({ item }: IGiftItem) => {
  const [alreadyLogged, setLogged] = useState(false);
  if (!alreadyLogged) {
    queries.log({ logType: LogType.clicked, document: item.title });
    setLogged(true);
  }

  const copyToClipboard = () => {
    if (!navigator.clipboard) {
      console.error("Clipboard API não suportada neste navegador");
      return;
    }
    navigator.clipboard
      .writeText(item.qrCodeLink)
      .then(() => {
        toast("Copiado", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
        });
      })
      .catch((err) => console.error("Erro ao copiar texto: ", err));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <p className={gifItemStyles.title}>
        {`Obrigado por nos dar um(a) `}
        <b>{item.title}</b>
      </p>
      <p className={gifItemStyles.subtitle}>
        {"Esse presente tem o valor de "} <b> {toBRLValue(item.value)}</b>. Abra
        o aplicativo do seu banco e na sessão de PIX e aponte a camera do seu
        celular para o QR code abaixo para nos presentear.
      </p>
      <div>
        <Image
          src={item.qrCode || ""}
          alt={`presente-${item.title}`}
          width={100}
          height={100}
          className={gifItemStyles.qrCodeImage}
        />
      </div>
      <p className={gifItemStyles.subtitle}>
        {"Caso prefira você pode copiar o código PIX clicando "}
        <span onClick={copyToClipboard}>aqui</span>
      </p>
      <ToastContainer
        style={{
          width: "100%",
        }}
        toastStyle={{
          backgroundColor: "white",
          color: "#3a0000",
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid #3a0000",
        }}
      />
    </div>
  );
};

export { GiftItem };
