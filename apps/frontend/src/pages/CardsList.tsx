import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardsStore } from '../contexts/CardsStoreContext';
import { PiTrash } from 'react-icons/pi';
import { TbSquareRoundedChevronLeft } from "react-icons/tb";
import {
  Container,
  Group,
  Title,
  Paper,
  Text,
  Button,
  Stack,
  Box,
  ActionIcon,
  Card,
  Divider,
  Badge,
  Center,
  rem
} from '@mantine/core';
import { useCardContext } from '../contexts/CardContext';

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
    <Container size="md" py="md">
      <Group justify="space-between" mb="lg">
        <Button 
          leftSection={<TbSquareRoundedChevronLeft size={20} />}
          variant="default" 
          onClick={() => navigate('/')}
        >
          Powrót do strony głównej
        </Button>
        <Title order={2}>Zapisane karty</Title>
      </Group>
      
      {cards.length === 0 ? (
        <Paper withBorder p="xl" radius="md" mt="xl">
          <Center>
            <Stack align="center">
              <Text>Brak zapisanych kart. Utwórz najpierw nową kartę.</Text>
              <Button 
                onClick={() => navigate('/create')} 
                mt="md"
              >
                Utwórz nową kartę
              </Button>
            </Stack>
          </Center>
        </Paper>
      ) : (
        <Stack gap="md" mt="md">
          {cards
            .sort((a, b) => b.lastUsed - a.lastUsed) // Sort by last used, newest first
            .map(card => (
              <Card key={card.id} withBorder shadow="sm" padding="md" radius="md">
                <Card.Section withBorder inheritPadding py="xs">
                  <Group justify="space-between">
                    <Text fw={600} size="lg">{card.cardInfo.name}</Text>
                    <ActionIcon 
                      color="red" 
                      variant="subtle"
                      onClick={() => onCardDelete(card.id)}
                      aria-label="Usuń kartę"
                    >
                      <PiTrash style={{ width: rem(18), height: rem(18) }} />
                    </ActionIcon>
                  </Group>
                </Card.Section>
                
                <Group mt="md" justify="space-between">
                  <Box>
                    <Text size="sm">Data: {card.cardInfo.date}</Text>
                    <Text size="sm">Auto #: {card.cardInfo.carNumber}</Text>
                    <Text size="xs" c="dimmed" mt={5}>
                      Ostatnio użyto: {formatDate(card.lastUsed)}
                    </Text>
                  </Box>
                  <Button
                    onClick={() => navigate(`/cards/${card.id}`)}
                    color="green"
                    size="sm"
                  >
                    Pokaż kartę
                  </Button>
                </Group>
                
                <Divider my="sm" />
                <Group>
                  <Badge variant="light">Etapy: {card.panels.length}</Badge>
                </Group>
              </Card>
            ))}
        </Stack>
      )}
               <Button 
          mt="xl"
          size="lg" 
          fullWidth 
          color="blue"
          onClick={() => navigate('/create')}
        >
          Utwórz nową kartę
        </Button>
    </Container>
  );
};