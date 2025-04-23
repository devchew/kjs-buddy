import { FunctionComponent, useState } from 'react';
import { Card as CardComponent } from '../components/Card';
import { useOffline } from '../hooks/offline';
import { AskNotificationBar } from '../components/AskNotificationBar';
import { WakeLock } from '../components/WakeLock';
import { Countdown } from '../components/Countdown';
import { useCardContext } from '../contexts/CardContext';
import { EditModeProvider, useEditModeContext } from '../contexts/EditModeContext';
import { useLongPress } from '../hooks/useLongPress';
import { PiPencil, PiFloppyDisk, PiX } from 'react-icons/pi';
import { CardPanel } from '../types/Event';

// Card content component that uses the edit mode context
const CardContent: FunctionComponent = () => {
  const isOffline = useOffline();
  const { addPanel, panels, updatePanels } = useCardContext();
  const { isEditMode, enableEditMode, disableEditMode } = useEditModeContext();
  
  // Store a backup of panels when entering edit mode
  const [panelsBackup, setPanelsBackup] = useState<CardPanel[]>([]);
  
  // Add a key state to force re-rendering of the Card component
  const [cardKey, setCardKey] = useState(0);
  
  // Long press handler for the edit button
  const longPressHandlers = useLongPress(
    () => {
      // Save a backup of panels before entering edit mode
      setPanelsBackup([...panels]);
      enableEditMode();
    },
    () => {},
    { delay: 800 }
  );
  
  // Save changes and exit edit mode
  const handleSave = () => {
    disableEditMode();
    // Force Card component to re-render with a new key
    setCardKey(prevKey => prevKey + 1);
  };
  
  // Discard changes and restore from backup
  const handleDiscard = () => {
    // Restore panels from backup
    updatePanels([...panelsBackup]);
    disableEditMode();
    // Force Card component to re-render with a new key
    setCardKey(prevKey => prevKey + 1);
  };

  return (
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
          <button 
            {...longPressHandlers}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#1b3c83',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <PiPencil size={20} /> Edit (press and hold)
          </button>
        )}
        
        {isEditMode && (
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