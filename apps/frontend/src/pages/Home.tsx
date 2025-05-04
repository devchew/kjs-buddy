import { FunctionComponent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { Header } from '../components/Header';

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
      
      <Stack maw={600} mx="auto" gap="md">
              
        {/* Last used card for quick access */}
        {lastUsedCard && (
          <Box mt="lg" w="100%">
            <Group justify="space-between" mb="xs">
              <Text fw={600} size="lg">Last Used Card</Text>
              <Divider w="60%" />
            </Group>
            <Link to={`/cards/${lastUsedCard.id}`} style={{ textDecoration: 'none' }}>
              <Paper p="sm" shadow="xs" >
                <Header />
              </Paper>
            </Link>          
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
      </Stack>
    </Container>
  );
};