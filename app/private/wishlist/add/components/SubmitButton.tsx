import { MouseEventHandler } from "react";
import styles from "../page.module.css";

type ButtonProps = {
  isLoading: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  title?: string;
};

const SubmitButton = ({
  isLoading,
  onClick,
  title = "Salvar",
}: ButtonProps) => {
  return (
    <button
      className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
      onClick={onClick}
      disabled={isLoading}
      type={onClick ? 'button' : "submit"}
    >
      {isLoading ? "" : title}
    </button>
  );
};

export default SubmitButton;
