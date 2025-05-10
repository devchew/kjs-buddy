import { FunctionComponent } from 'react';
import { useCardsStore } from '../contexts/CardsStoreContext';
import { PiTrash } from 'react-icons/pi';
import { useCardContext } from '@internal/rally-card';
import { LinkButton } from '../components/Button.tsx';
import { Panel } from '../components/Panel.tsx';
import { Pill } from '../components/Pill.tsx';

export const CardsListPage: FunctionComponent = () => {
  const { cards, deleteCard } = useCardsStore();
  const { unloadCard, id: contextCardId } = useCardContext();

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

  const havePanels = cards.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {!havePanels && <Panel>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p>Brak zapisanych kart.</p>
          </div>
        </Panel>}
        {havePanels && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {cards
            .sort((a, b) => b.lastUsed - a.lastUsed) // Sort by last used, newest first
            .map(card => (
              <Panel key={card.id} >
                <div style={{
                  borderBottom: '1px solid #e0e0e0',
                  paddingBottom: '0.5rem',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                    gap: '1rem'
                }}>
                  <span style={{ fontWeight: 600, fontSize: '1.25rem' }}>{card.cardInfo.name}</span>
                    <Pill>Etapy: {card.panels.length}</Pill>
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
                      cursor: 'pointer',
                        marginLeft: 'auto'
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
                  <LinkButton to={`/cards/${card.id}`} primary>
                    Pokaż kartę
                  </LinkButton>
                </div>
              </Panel>
            ))}
        </div>
      )}
        <LinkButton to='/create' primary>
            Utwórz nową kartę
        </LinkButton>
    </div>
  );
};
