import { FunctionComponent, PropsWithChildren } from "react";
import style from "./RallyCardWrapper.module.css";

export const RallyCardWrapper: FunctionComponent<PropsWithChildren> = ({
  children,
}) => <div className={style.wrapper}>{children}</div>;
