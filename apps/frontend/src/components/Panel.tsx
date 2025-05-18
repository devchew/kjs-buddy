import { FunctionComponent, PropsWithChildren } from "react";
import style from "./Panel.module.css";

export const Panel: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return <div className={style.panel}>{children}</div>;
};
