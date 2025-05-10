import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardsStore } from '../contexts/CardsStoreContext';
import { PiTrash } from 'react-icons/pi';
import { TbSquareRoundedChevronLeft } from "react-icons/tb";
import { useCardContext } from '@internal/rally-card';

export const CardsListPage: FunctionComponent = () => {
  const { cards, deleteCard } = useCardsStore();
  const { unloadCard, id: contextCardId } = useCardContext();
  const navigate = useNavigate();

  // Format date from timestamp
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const onCardDelete = (id: string) => {
    deleteCard(id);
    if (id === contextCardId) {
      unloadCard(); // Unload the card if it's the one currently in context
    }
  }

  return (
    <div style={{ maxWidth: '768px', margin: '0 auto', padding: '1rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            background: 'white',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          <TbSquareRoundedChevronLeft size={20} style={{ marginRight: '8px' }} />
          Powrót do strony głównej
        </button>
        <h2>Zapisane karty</h2>
      </div>

      {cards.length === 0 ? (
        <div style={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '2rem',
          marginTop: '2rem',
          background: 'white'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p>Brak zapisanych kart. Utwórz najpierw nową kartę.</p>
            <button
              style={{
                marginTop: '1rem',
                padding: '8px 16px',
                backgroundColor: '#228be6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/create')}
            >
              Utwórz nową kartę
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {cards
            .sort((a, b) => b.lastUsed - a.lastUsed) // Sort by last used, newest first
            .map(card => (
              <div key={card.id} style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                background: 'white'
              }}>
                <div style={{
                  borderBottom: '1px solid #e0e0e0',
                  paddingBottom: '0.5rem',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 600, fontSize: '1.25rem' }}>{card.cardInfo.name}</span>
                  <button
                    style={{
                      background: 'transparent',
                      color: '#e03131',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => onCardDelete(card.id)}
                    aria-label="Usuń kartę"
                  >
                    <PiTrash style={{ width: '18px', height: '18px' }} />
                  </button>
                </div>

                <div style={{
                  marginTop: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div>
                    <p style={{ fontSize: '0.875rem' }}>Data: {card.cardInfo.date}</p>
                    <p style={{ fontSize: '0.875rem' }}>Auto #: {card.cardInfo.carNumber}</p>
                    <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '5px' }}>
                      Ostatnio użyto: {formatDate(card.lastUsed)}
                    </p>
                  </div>
                  <button
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#2b8a3e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/cards/${card.id}`)}
                  >
                    Pokaż kartę
                  </button>
                </div>

                <hr style={{ margin: '0.75rem 0', border: '0', borderTop: '1px solid #e0e0e0' }} />

                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    backgroundColor: '#edf2ff',
                    color: '#3b5bdb',
                    borderRadius: '16px'
                  }}>
                    Etapy: {card.panels.length}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      <button
        style={{
          marginTop: '2rem',
          padding: '12px 20px',
          width: '100%',
          backgroundColor: '#228be6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/create')}
      >
        Utwórz nową kartę
      </button>
    </div>
  );
};
