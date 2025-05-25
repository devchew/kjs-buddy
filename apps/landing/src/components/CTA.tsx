
import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import '../styles/landing.css';
import { AppUrl } from '@/consts';

const CTA = () => {
  return (
    <section className="cta">
      <div className="cta-container">
        <h2 className="cta-title">Gotowy na Następny Rajd?</h2>
        <p className="cta-description">
          Dołącz do setek pilotów, którzy już korzystają z KJS-Buddy i odkryj
          nowy sposób zarządzania czasami w rajdach.
        </p>

        <div className="cta-buttons">
          <a href={AppUrl} className="cta-button-secondary">
            <ExternalLink className="w-5 h-5" />
            Przejdź do aplikacji
          </a>
        </div>

        <div className="cta-footer">
          <p>Dostępne jako Progressive Web App • Działa offline • Darmowe</p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
