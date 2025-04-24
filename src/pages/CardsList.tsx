import { FunctionComponent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCardsStore } from '../contexts/CardsStoreContext';
import {  PiTrash } from 'react-icons/pi';
import { TbSquareRoundedChevronLeft } from "react-icons/tb";

export const CardsListPage: FunctionComponent = () => {
  const { cards, deleteCard } = useCardsStore();
  const navigate = useNavigate();
  
  // Format date from timestamp
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: '#1b3c83',
          fontWeight: 'bold',
          marginRight: 'auto',
        }}>
          <TbSquareRoundedChevronLeft size={24} />
          Back to Home
        </Link>
        
        <h1 style={{ margin: 0 }}>Saved Cards</h1>
      </div>
      
      {cards.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          border: '1px dashed #ccc',
          borderRadius: '8px',
          marginTop: '2rem',
        }}>
          <p>No saved cards yet. Create a new card first.</p>
          <Link to="/create">
            <button style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}>
              Create New Card
            </button>
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          {cards
            .sort((a, b) => b.lastUsed - a.lastUsed) // Sort by last used, newest first
            .map(card => (
              <div key={card.id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: 'white'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <h3 style={{ margin: '0' }}>{card.cardInfo.name}</h3>
                  <button
                    onClick={() => deleteCard(card.id)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#ef476f',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                    aria-label="Delete card"
                  >
                    <PiTrash size={20} />
                  </button>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  <div>
                    <p style={{ margin: '0.25rem 0' }}>Date: {card.cardInfo.date}</p>
                    <p style={{ margin: '0.25rem 0' }}>Car #: {card.cardInfo.carNumber}</p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: '#666' }}>
                      Last used: {formatDate(card.lastUsed)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => navigate(`/cards/${card.id}`)}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      View Card
                    </button>
                  </div>
                </div>
                
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px'
                }}>
                  <p style={{ margin: '0', fontWeight: 'bold' }}>Panels: {card.panels.length}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};