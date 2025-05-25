
import React from 'react';
import { CheckCircle } from 'lucide-react';
import '../styles/landing.css';

const Benefits = () => {
  const benefits = [
    "Automatyzacja obliczeń czasowych",
    "Eliminacja błędów w obliczeniach czasowych",
    "Oszczędność czasu podczas rajdu", 
    "Backup cyfrowy tradycyjnej karty",
    "Intuicyjny interfejs użytkownika"
  ];

  return (
    <section className="section">
      <div className="section-container">
        <div className="benefits-content">
          <div>
            <h2 className="benefits-title">
              Dlaczego Warto Użyć 
              <br />
              Naszej Aplikacji?
            </h2>
            <p className="benefits-description">
              Nasza aplikacja została stworzona przez rajdowców dla rajdowców. 
              Rozumiemy wyzwania, z jakimi borykają się piloci podczas zawodów.
            </p>
            
            <ul className="benefits-list">
              {benefits.map((benefit, index) => (
                <li key={index} className="benefits-item">
                  <CheckCircle className="w-6 h-6" style={{ color: 'var(--primary-custom)', opacity: 0.7, flexShrink: 0 }} />
                  <span className="benefits-item-text">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="benefits-stats">
            <h3 className="benefits-stats-title">Statystyki Użytkowania</h3>
            
            <div className="benefits-stats-grid">
              <div className="benefits-stat">
                <div className="benefits-stat-number">98%</div>
                <div className="benefits-stat-label">Dokładność obliczeń</div>
              </div>
              
              <div className="benefits-stat">
                <div className="benefits-stat-number">75%</div>
                <div className="benefits-stat-label">Oszczędność czasu</div>
              </div>
              
              <div className="benefits-stat">
                <div className="benefits-stat-number">500+</div>
                <div className="benefits-stat-label">Aktywnych pilotów</div>
              </div>
              
              <div className="benefits-stat">
                <div className="benefits-stat-number">24/7</div>
                <div className="benefits-stat-label">Dostępność</div>
              </div>
            </div>
            
            <div className="benefits-decorative-1"></div>
            <div className="benefits-decorative-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
