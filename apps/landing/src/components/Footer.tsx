
import React from 'react';
import { Flag } from 'lucide-react';
import '../styles/landing.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div>
            <div className="footer-brand">
              <div className="footer-brand-icon">
                <Flag
                  className="w-5 h-5"
                  style={{ color: "var(--primary-custom)" }}
                />
              </div>
              <div className="footer-brand-text">
                <h3>Rally Pilot</h3>
                <p>Companion</p>
              </div>
            </div>
            <p className="footer-description">
              Cyfrowa karta czasów dla rajdów KJS. Stworzona przez rajdowców dla
              rajdowców.
            </p>
          </div>

          {/* <div className="footer-section">
            <h4>Aplikacja</h4>
            <ul className="footer-links">
              <li><a href="#">Pobierz</a></li>
              <li><a href="#">Funkcje</a></li>
              <li><a href="#">Dokumentacja</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Wsparcie</h4>
            <ul className="footer-links">
              <li><a href="#">Pomoc</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Kontakt</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Rajdy KJS</h4>
            <ul className="footer-links">
              <li><a href="#">Regulamin</a></li>
              <li><a href="#">Kalendarz</a></li>
              <li><a href="#">Wyniki</a></li>
            </ul>
          </div> */}
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Rally Pilot Companion. Wszystkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
