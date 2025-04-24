import { FunctionComponent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCardsStore } from '../contexts/CardsStoreContext';

export const HomePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { cards, lastUsedCardId } = useCardsStore();

  // Get the last used card for quick access
  const lastUsedCard = lastUsedCardId 
    ? cards.find(card => card.id === lastUsedCardId) 
    : null;
  
  // Get recent cards (up to 3, excluding last used)
  const recentCards = cards
    .filter(card => card.id !== lastUsedCardId)
    .sort((a, b) => b.lastUsed - a.lastUsed)
    .slice(0, 3);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
    }}>
      <h1>Welcome to KJS Buddy</h1>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginTop: '2rem',
        width: '100%',
        maxWidth: '400px',
      }}>
        <Link to="/create">
          <button 
            style={{
              padding: '10px 20px',
              fontSize: '18px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Create New Card
          </button>
        </Link>
        
        <Link to="/cards">
          <button 
            style={{
              padding: '10px 20px',
              fontSize: '18px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            All Cards
          </button>
        </Link>
        
        {/* Last used card for quick access */}
        {lastUsedCard && (
          <div style={{ marginTop: '2rem', width: '100%' }}>
            <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
              Last Used Card
            </h2>
            <div 
              onClick={() => navigate(`/cards/${lastUsedCard.id}`)}
              style={{
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                marginTop: '0.5rem',
                cursor: 'pointer',
                border: '1px solid #ddd',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.1s',
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontWeight: 'bold' }}>{lastUsedCard.cardInfo.name}</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                {lastUsedCard.cardInfo.date} | Car #{lastUsedCard.cardInfo.carNumber}
              </div>
            </div>
          </div>
        )}
        
        {/* Recent cards section */}
        {recentCards.length > 0 && (
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
              Recent Cards
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              {recentCards.map(card => (
                <div 
                  key={card.id}
                  onClick={() => navigate(`/cards/${card.id}`)}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: '1px solid #ddd',
                    transition: 'transform 0.1s',
                  }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ fontWeight: 'bold' }}>{card.cardInfo.name}</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {card.cardInfo.date} | Car #{card.cardInfo.carNumber}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};