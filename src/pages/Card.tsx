import { FunctionComponent, useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Card as CardComponent } from '../components/Card';
import { useOffline } from '../hooks/offline';
import { AskNotificationBar } from '../components/AskNotificationBar';
import { WakeLock } from '../components/WakeLock';
import { Countdown } from '../components/Countdown';
import { useCardContext } from '../contexts/CardContext';
import { EditModeProvider, useEditModeContext } from '../contexts/EditModeContext';
import { useCardsStore } from '../contexts/CardsStoreContext';
import { PiPencil, PiFloppyDisk, PiX } from 'react-icons/pi';
import { TbSquareRoundedChevronLeft } from "react-icons/tb";
import { CardPanel } from '../types/Event';
import { LongPressButton } from '../components/LongPressButton';

// Card content component that uses the edit mode context
const CardContent: FunctionComponent = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isOffline = useOffline();
  const { addPanel, panels, updatePanels, cardInfo, updateCardInfo } = useCardContext();
  const { isEditMode, enableEditMode, disableEditMode } = useEditModeContext();
  const { lastUsedCardId, updateCard, saveCard, getCard } = useCardsStore();
  
  // Store a backup of panels when entering edit mode
  const [panelsBackup, setPanelsBackup] = useState<CardPanel[]>([]);
  
  // Add a key state to force re-rendering of the Card component
  const [cardKey, setCardKey] = useState(0);
  
  // Load card data when component mounts or id changes
  useEffect(() => {
    if (id) {
      const card = getCard(id);
      if (!card) {
        navigate('/cards');
        return;
      }
      
      // Update context with card data
      updateCardInfo(card.cardInfo);
      updatePanels(card.panels);
    }
  }, [id]);

  const handleLongPress = () => {
    // Save a backup of panels before entering edit mode
    setPanelsBackup([...panels]);
    enableEditMode();
  };
  
  // Save changes and exit edit mode
  const handleSave = () => {
    disableEditMode();
    // Force Card component to re-render with a new key
    setCardKey(prevKey => prevKey + 1);
    
    if (id) {
      // Update existing card
      updateCard(id, cardInfo, panels);
    } else if (lastUsedCardId) {
      // Update last used card
      updateCard(lastUsedCardId, cardInfo, panels);
    } else {
      // Save as a new card
      saveCard(cardInfo, panels);
    }
  };
  
  // Discard changes and restore from backup
  const handleDiscard = () => {
    if (id) {
      // Reload the card from storage to reset any changes
      const card = getCard(id);
      if (card) {
        updateCardInfo(card.cardInfo);
        updatePanels(card.panels);
      }
    } else {
      // Restore panels from backup
      updatePanels([...panelsBackup]);
    }
    
    disableEditMode();
    // Force Card component to re-render with a new key
    setCardKey(prevKey => prevKey + 1);
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
        <Link to={id ? "/cards" : "/"} style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: '#1b3c83',
          fontWeight: 'bold',
          marginRight: 'auto',
        }}>
          <TbSquareRoundedChevronLeft size={24} />
          {id ? "Back to Cards" : "Back to Home"}
        </Link>
        
        <h1 style={{ margin: 0 }}>{id ? "View Card" : "Current Card"}</h1>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '5rem',
      }}>
        {/* Use the key prop to force complete re-rendering when the key changes */}
        <CardComponent key={cardKey} />
        
        <div style={{ 
          margin: '1rem 0',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isEditMode ? (
            <>
              <button 
                onClick={addPanel}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#1b3c83',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Add Panel
              </button>
              <button 
                onClick={handleSave}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <PiFloppyDisk size={20} /> Save
              </button>
              
              <button 
                onClick={handleDiscard}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#ef476f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <PiX size={20} /> Discard
              </button>
            </>
          ) : (
            <LongPressButton 
              onLongPress={handleLongPress}
            >
              <PiPencil size={20} /> Edit (press and hold)
            </LongPressButton>
          )}
        
        </div>
        
        {isOffline && <div style={{
          padding: '1rem',
          backgroundColor: 'red',
          color: 'white',
          borderRadius: '1rem',
        }}>
          Brak połączenia z internetem
        </div>}
        <AskNotificationBar />
        <WakeLock />
        <Countdown />
      </div>
    </div>
  );
};

// Main Card page component wrapped with EditModeProvider
export const CardPage: FunctionComponent = () => {
  return (
    <EditModeProvider>
      <CardContent />
    </EditModeProvider>
  );
};