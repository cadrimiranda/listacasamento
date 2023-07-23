"use client";
import { useEffect } from "react";
import { data } from "./data";
import useModalHandler from "@/src/useModalHandler";
import Modal from "@/components/Modal/Modal";
import { GiftItem } from "@/components/WishList/giftItem/giftItem";

const Testmodal = () => {
  const refModal = useModalHandler();
  useEffect(() => {
    refModal.openModal();
  }, []);

  return (
    <Modal ref={refModal.ref}>
      <GiftItem item={data} />
    </Modal>
  );
};

export default Testmodal;
