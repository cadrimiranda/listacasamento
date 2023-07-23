import { ModalHandler } from "@/components/Modal/Modal";
import { useRef } from "react";

const useModalHandler = () => {
  const refModal = useRef<ModalHandler>({
    openModal: () => {},
    isModalOpened: false,
    handleOnClose: () => {},
    closeModal: () => {},
  });

  return { ref: refModal, ...refModal.current };
};

export default useModalHandler;
