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

export const CardsListPage: FunctionComponent = () => {
  const { cards, deleteCard } = useCardsStore();
  const navigate = useNavigate();
  
  // Format date from timestamp
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  
  return (
    <Container size="md" py="md">
      <Group justify="space-between" mb="lg">
        <Button 
          leftSection={<TbSquareRoundedChevronLeft size={20} />}
          variant="default" 
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
        <Title order={2}>Saved Cards</Title>
      </Group>
      
      {cards.length === 0 ? (
        <Paper withBorder p="xl" radius="md" mt="xl">
          <Center>
            <Stack align="center">
              <Text>No saved cards yet. Create a new card first.</Text>
              <Button 
                onClick={() => navigate('/create')} 
                mt="md"
              >
                Create New Card
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
                      onClick={() => deleteCard(card.id)}
                      aria-label="Delete card"
                    >
                      <PiTrash style={{ width: rem(18), height: rem(18) }} />
                    </ActionIcon>
                  </Group>
                </Card.Section>
                
                <Group mt="md" justify="space-between">
                  <Box>
                    <Text size="sm">Date: {card.cardInfo.date}</Text>
                    <Text size="sm">Car #: {card.cardInfo.carNumber}</Text>
                    <Text size="xs" c="dimmed" mt={5}>
                      Last used: {formatDate(card.lastUsed)}
                    </Text>
                  </Box>
                  <Button
                    onClick={() => navigate(`/cards/${card.id}`)}
                    color="green"
                    size="sm"
                  >
                    View Card
                  </Button>
                </Group>
                
                <Divider my="sm" />
                <Group>
                  <Badge variant="light">Panels: {card.panels.length}</Badge>
                </Group>
              </Card>
            ))}
        </Stack>
      )}
    </Container>
  );
};