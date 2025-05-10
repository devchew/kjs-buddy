import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card as CardComponent, useCardContext } from '@internal/rally-card';
import { useCardsStore } from '../contexts/CardsStoreContext';
import { PiFloppyDisk, PiPencil, PiX } from 'react-icons/pi';
import { TbSquareRoundedChevronLeft } from "react-icons/tb";
import { CardPanel } from '../types/Card';
import { LongPressButton } from '../components/LongPressButton.tsx';
import { useBroadcast } from '../hooks/useBroadcast.ts';

// Card content component that uses the edit mode context
export const CardPage: FunctionComponent = () => {
  const params = useParams<{ id: string }>();
  const id = params.id as string;
  const navigate = useNavigate();
  const { addPanel, panels, updatePanels, cardInfo, updateCardInfo, id: localCardId, setId, isEditMode, setIsEditMode } = useCardContext();
  const { updateCard, getCard, loading } = useCardsStore();
  // Store a backup of panels when entering edit mode
  const [panelsBackup, setPanelsBackup] = useState<CardPanel[]>([]);
  const { postMessage }  = useBroadcast();


  // Store the current card in local storage
  useEffect(() => {
    if (isEditMode || loading) return;
    updateCard(id, cardInfo, panels);
    postMessage('cardInfo', cardInfo);
    postMessage('panels', panels);
    localStorage.setItem('currentCard', JSON.stringify({cardInfo, panels, id: localCardId}));
  }, [loading, panels, cardInfo]);

  // Load card data when component mounts or id changes
  useEffect(() => {
    if (loading) return; // Wait for loading to finish
    if (id === localCardId) {
      // If the card is the last used one, we can skip loading it again
      return;
    }
    getCard(id).then((card) => {

      if (!card) {
        navigate('/cards');
        return;
      }

      // Update context with card data
      updateCardInfo(card.cardInfo);
      updatePanels(card.panels);
      setId(id);
    })
  }, [id, loading]);

  const handleLongPress = () => {
    // Save a backup of panels before entering edit mode
    setPanelsBackup([...panels]);
    setIsEditMode(true)
  };

  // Save changes and exit edit mode
  const handleSave = () => {
    setIsEditMode(false);
    updateCard(id, cardInfo, panels);
  };

  // Discard changes and restore from backup
  const handleDiscard = () => {
    updatePanels([...panelsBackup]);
    setIsEditMode(false);
  };

  if (loading || !cardInfo || !panels || localCardId !== id) {
    return <div>Ładowanie...</div>; // Show loading state while fetching data
  }

  return (
    <div style={{
      maxWidth: '768px',
      margin: '0 auto',
      padding: '1rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => navigate(id ? "/cards" : "/")}
        >
          <TbSquareRoundedChevronLeft size={20} />
          {id ? "Powrót do kart" : "Powrót do strony głównej"}
        </button>
        <h2>{id ? "Podgląd karty" : "Aktualna karta"}</h2>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '2rem'
      }}>
        <CardComponent />

        <div style={{
          marginTop: '1rem',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem'
        }}>
          {isEditMode ? (
            <>
              <button
                onClick={addPanel}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#228be6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Dodaj panel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2b8a3e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <PiFloppyDisk size={20} />
                Zapisz
              </button>
              <button
                onClick={handleDiscard}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e03131',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <PiX size={20} />
                Anuluj
              </button>
            </>
          ) : (
            <LongPressButton
              onLongPress={handleLongPress}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <PiPencil size={20} />
              Edytuj (naciśnij i przytrzymaj)
            </LongPressButton>
          )}
        </div>
      </div>
    </div>
  );
};
