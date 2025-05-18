import { FunctionComponent, PropsWithChildren } from "react";
import style from "./Pill.module.css";

export const Pill: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <span className={style.pill}>{children}</span>
);
