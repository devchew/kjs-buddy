import { FunctionComponent, ReactNode } from "react";
import styles from "./TextLink.module.css";

interface TextLinkProps {
  onClick: () => void;
  children: ReactNode;
}

export const TextLink: FunctionComponent<TextLinkProps> = ({
  onClick,
  children,
}) => {
  return (
    <button onClick={onClick} className={styles.link}>
      {children}
    </button>
  );
};
