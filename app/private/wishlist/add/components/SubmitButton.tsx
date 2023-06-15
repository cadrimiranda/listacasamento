import { MouseEventHandler } from "react";
import styles from "../page.module.css";

type ButtonProps = {
  isLoading: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const SubmitButton = ({ isLoading, onClick }: ButtonProps) => {
  return (
    <button
      className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
      onClick={onClick}
      disabled={isLoading}
      type="submit"
    >
      {isLoading ? "" : "Submit"}
    </button>
  );
};

export default SubmitButton;
