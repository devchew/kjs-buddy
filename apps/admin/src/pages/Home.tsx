import { FunctionComponent } from "react";
import { LinkButton } from "../components/Button.tsx";
import style from "./Home.module.css";

export const HomePage: FunctionComponent = () => {
  return (
    <div className={style.container}>
      <div className={style.stack}>
        <h1>Witaj w KJS Buddy! Admin</h1>
        <p>Twój pomocnik w rajdzie</p>
        <p>Wszystko co potrzebujesz w jednym miejscu</p>
        <hr />
        <LinkButton to="/templates">Wszystkie karty</LinkButton>
      </div>
    </div>
  );
};
