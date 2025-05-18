import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Header, useCardContext } from "@internal/rally-card";
import style from "./Home.module.css";
import { RallyCardWrapper } from "../components/RallyCardWrapper.tsx";
import { LinkButton } from "../components/Button.tsx";
import { useAuth } from "../contexts/AuthContext.tsx";
import { useCardsStore } from "../contexts/CardsStoreContext.tsx";

export const HomePage: FunctionComponent = () => {
  const { id: currentCardId } = useCardContext();
  const { isAuthenticated } = useAuth();
  const { cards } = useCardsStore();

  return (
    <div className={style.container}>
      <div className={style.stack}>
        {!currentCardId && (
          <>
            <h1>Witaj w KJS Buddy!</h1>
            <p>Twój pomocnik w rajdzie</p>
            <p>Wszystko co potrzebujesz w jednym miejscu</p>
            <hr />
            {cards.length > 0 ? (
              <LinkButton to="/cards">Wszystkie karty</LinkButton>
            ) : (
              <LinkButton to="/create" primary>
                Stwórz swoją pierwszą kartę
              </LinkButton>
            )}

            {!isAuthenticated && (
              <>
                <p>Lub zaloguj się miej swoje karty zawsze przy sobie</p>
                <LinkButton to="/login">Zaloguj się</LinkButton>
              </>
            )}
          </>
        )}{" "}
        {currentCardId && (
          <div className={style.card}>
            <div className={style.cardHeader}>
              <p className={style.cardTitle}>Aktywna karta</p>
            </div>
            <Link
              to={`/cards/${currentCardId}`}
              style={{ textDecoration: "none" }}
            >
              <div className={style.cardContent}>
                <RallyCardWrapper>
                  <Header />
                </RallyCardWrapper>
              </div>
            </Link>
          </div>
        )}
        {cards.length > 0 && (
          <LinkButton to="/cards">Wszystkie karty</LinkButton>
        )}
      </div>
    </div>
  );
};
