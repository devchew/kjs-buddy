
import React from 'react';
import { Flag, Clock, Smartphone, Users } from 'lucide-react';
import '../styles/landing.css';
import { AppUrl } from '@/consts';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-gradient"></div>
      </div>

      <div className="hero-stripes-top"></div>
      <div className="hero-stripes-bottom"></div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <Flag
                className="w-5 h-5"
                style={{ color: "var(--primary-custom)" }}
              />
              <span>KJS-Buddy - pomocnik pilota</span>
            </div>

            <h1 className="hero-title">
              Cyfrowa
              <span className="hero-title-sub">Karta Czasów</span>
              <span className="hero-title-small">dla Rajdów KJS</span>
            </h1>

            <p className="hero-description">
              Automatyzuj obliczenia interwałów czasowych, otrzymuj
              powiadomienia o startach i udostępniaj kartę czasów organizatorom
              w czasie rzeczywistym.
            </p>

            <div className="hero-features">
              <div className="hero-feature">
                <div className="hero-feature-icon">
                  <Clock
                    className="w-6 h-6"
                    style={{ color: "var(--primary-custom)" }}
                  />
                </div>
                <div className="hero-feature-text">
                  <h3>Automatyczne</h3>
                  <p>Obliczenia czasów</p>
                </div>
              </div>

              <div className="hero-feature">
                <div className="hero-feature-icon">
                  <Smartphone
                    className="w-6 h-6"
                    style={{ color: "var(--primary-custom)" }}
                  />
                </div>
                <div className="hero-feature-text">
                  <h3>PWA</h3>
                  <p>Dostęp offline</p>
                </div>
              </div>

              <div className="hero-feature">
                <div className="hero-feature-icon">
                  <Users
                    className="w-6 h-6"
                    style={{ color: "var(--primary-custom)" }}
                  />
                </div>
                <div className="hero-feature-text">
                  <h3>Szablony</h3>
                  <p>Gotowe karty</p>
                </div>
              </div>
            </div>

            <div className="hero-buttons">
              <a href={AppUrl} className="hero-button-primary">
                Przejdź do aplikacji
              </a>
            </div>
          </div>

          <div className="hero-phone">
            <div className="hero-phone-frame">
              <div className="hero-phone-screen">
                <div className="hero-phone-statusbar">
                  <div className="hero-phone-notch"></div>
                </div>

                <div style={{ position: "relative" }}>
                  <img
                    src="/cardpreview.png"
                    alt="Rally Timing App Screenshot"
                    className="hero-phone-image"
                  />
                  <div className="hero-phone-overlay"></div>
                </div>
              </div>
            </div>

            <div className="hero-floating-icon hero-floating-icon-1">
              <Flag
                className="w-8 h-8"
                style={{ color: "var(--primary-custom)" }}
              />
            </div>

            <div className="hero-floating-icon hero-floating-icon-2">
              <Clock
                className="w-6 h-6"
                style={{ color: "var(--primary-custom)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
