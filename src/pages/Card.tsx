import { FunctionComponent, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { MantineLongPressButton } from '../components/MantineLongPressButton';
import { 
  Container, 
  Group, 
  Title, 
  Button, 
  Stack, 
  Alert,
  Box
} from '@mantine/core';

// Card content component that uses the edit mode context
const CardContent: FunctionComponent = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isOffline = useOffline();
  const { addPanel, panels, updatePanels, cardInfo, updateCardInfo } = useCardContext();
  const { isEditMode, enableEditMode, disableEditMode } = useEditModeContext();
  const { lastUsedCardId, updateCard, saveCard, getCard, loading } = useCardsStore();
  
  // Store a backup of panels when entering edit mode
  const [panelsBackup, setPanelsBackup] = useState<CardPanel[]>([]);
  
  // Add a key state to force re-rendering of the Card component
  const [cardKey, setCardKey] = useState(0);
  
  // Load card data when component mounts or id changes
  useEffect(() => {
    if (loading) return; // Wait for loading to finish
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
  }, [id, loading]);

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

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <Container size="md" py="md">
      <Group justify="space-between" mb="lg">
        <Button
          leftSection={<TbSquareRoundedChevronLeft size={20} />}
          variant="default"
          onClick={() => navigate(id ? "/cards" : "/")}
        >
          {id ? "Back to Cards" : "Back to Home"}
        </Button>
        <Title order={2}>{id ? "View Card" : "Current Card"}</Title>
      </Group>
      
      <Stack align="center" pb="xl">
        {/* KEEPING THE ORIGINAL CARD COMPONENT INTACT */}
        <CardComponent key={cardKey} />
        
        <Group my="md" justify="center">
          {isEditMode ? (
            <>
              <Button 
                onClick={addPanel}
                color="blue"
              >
                Add Panel
              </Button>
              <Button 
                onClick={handleSave}
                color="green"
                leftSection={<PiFloppyDisk size={20} />}
              >
                Save
              </Button>
              <Button 
                onClick={handleDiscard}
                color="red"
                leftSection={<PiX size={20} />}
              >
                Discard
              </Button>
            </>
          ) : (
            <MantineLongPressButton 
              onLongPress={handleLongPress}
              leftSection={<PiPencil size={20} />}
            >
              Edit (press and hold)
            </MantineLongPressButton>
          )}
        </Group>
        
        {isOffline && (
          <Alert color="red" radius="md" title="Offline">
            Brak połączenia z internetem
          </Alert>
        )}
        
        <Box>
          <AskNotificationBar />
          <WakeLock />
          <Countdown />
        </Box>
      </Stack>
    </Container>
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