import { FunctionComponent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCardsStore } from "../contexts/CardsStoreContext";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/Header";
import { TbLogin, TbUser, TbUserPlus } from "react-icons/tb";
import { useCardContext } from "../contexts/CardContext";
import "./Home.css";

export const HomePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { cards } = useCardsStore();
  const { id: currentCardId } = useCardContext();
  const { user, isAuthenticated } = useAuth();

  const recentCards = cards
    .sort((a, b) => b.lastUsed - a.lastUsed)
    .slice(0, 3);

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Witaj w KJS Buddy</h1>
        {isAuthenticated ? (
          <button className="button" onClick={() => navigate("/profile")}>
            <TbUser size={20} /> {user?.email?.split('@')[0] || 'Profile'}
          </button>
        ) : (
          <div className="auth-buttons">
            <button className="button" onClick={() => navigate("/login")}>
              <TbLogin size={20} /> Log In
            </button>
            <button className="button button-light" onClick={() => navigate("/register")}>
              <TbUserPlus size={20} /> Register
            </button>
          </div>
        )}
      </div>

      <div className="stack">
        {isAuthenticated && (
          <div className="card">
            <p>Witaj, {user?.email?.split('@')[0] || 'User'}! Twoje karty są synchronizowane w chmurze.</p>
          </div>
        )}

        {!isAuthenticated && (
          <div className="card">
            <p>Zaloguj się lub zarejestruj, aby synchronizować karty w chmurze.</p>
          </div>
        )}

        {currentCardId && (
          <div className="card">
            <div className="card-header">
              <p className="card-title">Aktywna karta</p>
              <hr className="card-divider" />
            </div>
            <Link to={`/cards/${currentCardId}`} style={{ textDecoration: 'none' }}>
              <div className="card-content">
                <Header />
              </div>
            </Link>
          </div>
        )}

        {recentCards.length > 0 && (
          <div className="card">
            <div className="card-header">
              <p className="card-title">Ostatnie karty</p>
              <hr className="card-divider" />
            </div>
            <div className="recent-cards">
              {recentCards.map((card) => (
                <div
                  key={card.id}
                  className="recent-card"
                  onClick={() => navigate(`/cards/${card.id}`)}
                >
                  <p className="recent-card-title">{card.cardInfo.name}</p>
                  <p className="recent-card-subtitle">{card.cardInfo.date} | Auto #{card.cardInfo.carNumber}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="button-green" onClick={() => navigate("/cards")}>Wszystkie karty</button>
        <button className="button-blue" onClick={() => navigate("/create")}>Utwórz nową kartę</button>
      </div>
    </div>
  );
};
