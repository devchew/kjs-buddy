
import React from 'react';
import { Flag } from 'lucide-react';
import '../styles/landing.css';
import { AppUrl } from '@/consts';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-logo">
            <div className="header-logo-icon">
              <Flag
                className="w-6 h-6"
                style={{ color: "var(--primary-custom)" }}
              />
            </div>
            <div className="header-logo-text">
              <h1>KJS-Buddy</h1>
              <p>Pomocnik pilota</p>
            </div>
          </div>

          <nav className="header-nav">
            <a href="#features">Funkcje</a>
            <a href="#benefits">Korzyści</a>
            <a href="#contact">Kontakt</a>
          </nav>

          <a href={AppUrl} className="header-button">
            Przejdź do aplikacji
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
