
import React from 'react';
import { Clock, Smartphone, Users, Flag, Bell, Share2 } from 'lucide-react';
import '../styles/landing.css';

const Features = () => {
  const features = [
    {
      icon: Clock,
      title: "Automatyczne obliczenia",
      description: "System automatycznie oblicza czasy na podtawie poprzednich pól, eliminując potrzebę ręcznego wprowadzania danych.",
    },
    {
      icon: Bell,
      title: "Powiadomienia",
      description: "Otrzymuj powiadomienia o zbliżających się startach, aby nigdy nie przegapić swojej kolejki.",
    },
    // {
    //   icon: Share2,
    //   title: "Udostępnianie w Czasie Rzeczywistym",
    //   description: "Udostępniaj kartę czasów organizatorom i obserwatorom rajdu w czasie rzeczywistym.",
    // },
    {
      icon: Smartphone,
      title: "Progressive Web App",
      description: "Dostęp do aplikacji offline, instalacja bezpośrednio z przeglądarki bez sklepu z aplikacjami.",
    },
    {
      icon: Flag,
      title: "Dedykowane dla KJS",
      description: "Specjalnie zaprojektowane dla rajdów klasy KJS z uwzględnieniem specyficznych wymagań.",
    }
  ];

  return (
    <section className="section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Funkcje Aplikacji</h2>
          <p className="section-description">
            Kompleksowe narzędzie cyfrowe, które rewolucjonizuje sposób zarządzania czasami w rajdach KJS
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <feature.icon className="w-6 h-6" style={{ color: 'var(--primary-custom)' }} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
