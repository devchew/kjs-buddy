import { FunctionComponent, ReactNode } from "react";
import styles from "./FormField.module.css";
import { TbAlertCircle } from "react-icons/tb";

interface FormFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const FormField: FunctionComponent<FormFieldProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  required = true,
}) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

interface ErrorMessageProps {
  title: string;
  children: ReactNode;
}

export const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({
  title,
  children,
}) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorHeader}>
        <TbAlertCircle />
        <strong>{title}</strong>
      </div>
      {children}
    </div>
  );
};
