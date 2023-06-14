import React, { ChangeEvent, Ref, forwardRef } from "react";
import styles from "./style.module.css";

type InputWithLabelProps = {
  label: string;
  id: string;
  value?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled: boolean;
};

const InputWithLabel = forwardRef<HTMLInputElement, InputWithLabelProps>(
  (
    { label, id, value, onChange, type = "text", disabled },
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <div className={styles.inputContainer}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <input
          disabled={disabled}
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          ref={ref}
          className={styles.input}
        />
      </div>
    );
  }
);

InputWithLabel.displayName = "InputWithLabel";

export default InputWithLabel;
