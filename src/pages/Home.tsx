import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardsStore } from '../contexts/CardsStoreContext';
import { 
  Container, 
  Title, 
  Stack, 
  Button, 
  Paper, 
  Text, 
  Group,
  Box,
  Divider
} from '@mantine/core';

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
    <Container py="xl" size="md">
      <Title ta="center" mb="xl">Welcome to KJS Buddy</Title>
      
      <Stack maw={400} mx="auto" gap="md">
        <Button 
          size="lg" 
          fullWidth 
          color="blue"
          onClick={() => navigate('/create')}
        >
          Create New Card
        </Button>
        
        <Button 
          size="lg" 
          fullWidth 
          color="green"
          onClick={() => navigate('/cards')}
        >
          All Cards
        </Button>
        
        {/* Last used card for quick access */}
        {lastUsedCard && (
          <Box mt="lg" w="100%">
            <Group justify="space-between" mb="xs">
              <Text fw={600} size="lg">Last Used Card</Text>
              <Divider w="60%" />
            </Group>
            <Paper 
              p="md" 
              radius="md" 
              withBorder
              onClick={() => navigate(`/cards/${lastUsedCard.id}`)}
              style={{ cursor: 'pointer' }}
              shadow="xs"
            >
              <Text fw={700}>{lastUsedCard.cardInfo.name}</Text>
              <Text size="sm" c="dimmed">
                {lastUsedCard.cardInfo.date} | Car #{lastUsedCard.cardInfo.carNumber}
              </Text>
            </Paper>
          </Box>
        )}
        
        {/* Recent cards section */}
        {recentCards.length > 0 && (
          <Box mt="md" w="100%">
            <Group justify="space-between" mb="xs">
              <Text fw={600} size="lg">Recent Cards</Text>
              <Divider w="60%" />
            </Group>
            <Stack gap="xs">
              {recentCards.map(card => (
                <Paper 
                  key={card.id}
                  p="sm" 
                  radius="md"
                  withBorder
                  onClick={() => navigate(`/cards/${card.id}`)}
                  style={{ cursor: 'pointer' }}
                  shadow="xs"
                >
                  <Text fw={700}>{card.cardInfo.name}</Text>
                  <Text size="sm" c="dimmed">
                    {card.cardInfo.date} | Car #{card.cardInfo.carNumber}
                  </Text>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Container>
  );
};