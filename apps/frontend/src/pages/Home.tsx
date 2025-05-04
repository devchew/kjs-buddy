import { FunctionComponent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCardsStore } from "../contexts/CardsStoreContext";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  Title,
  Stack,
  Button,
  Paper,
  Text,
  Group,
  Box,
  Divider,
  Avatar,
} from "@mantine/core";
import { Header } from "../components/Header";
import { TbLogin, TbUser, TbUserPlus } from "react-icons/tb";

export const HomePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { cards, lastUsedCardId } = useCardsStore();
  const { user, isAuthenticated } = useAuth();

  // Get the last used card for quick access
  const lastUsedCard = lastUsedCardId
    ? cards.find((card) => card.id === lastUsedCardId)
    : null;

  // Get recent cards (up to 3, excluding last used)
  const recentCards = cards
    .filter((card) => card.id !== lastUsedCardId)
    .sort((a, b) => b.lastUsed - a.lastUsed)
    .slice(0, 3);

  return (
    <Container py="xl" size="md">
      <Group justify="space-between" mb="md">
        <Title ta="center">
          Witaj w KJS Buddy
        </Title>
        
        {isAuthenticated ? (
          <Button
            variant="subtle"
            onClick={() => navigate("/profile")}
            leftSection={<TbUser size={20} />}
          >
            {user?.email?.split('@')[0] || 'Profile'}
          </Button>
        ) : (
          <Group>
            <Button
              variant="subtle"
              onClick={() => navigate("/login")}
              leftSection={<TbLogin size={20} />}
            >
              Log In
            </Button>
            <Button
              variant="light"
              onClick={() => navigate("/register")}
              leftSection={<TbUserPlus size={20} />}
            >
              Register
            </Button>
          </Group>
        )}
      </Group>

      <Stack maw={600} mx="auto" gap="md">
        {isAuthenticated && (
          <Paper p="xs" withBorder radius="md" mb="lg">
            <Text fw={500} size="sm">
              Witaj, {user?.email?.split('@')[0] || 'User'}!
              Twoje karty są synchronizowane w chmurze.
            </Text>
          </Paper>
        )}
        
        {!isAuthenticated && (
          <Paper p="xs" withBorder radius="md" mb="lg">
            <Text fw={500} size="sm" mb="xs">
              You're using the app in local mode. 
            </Text>
            <Text size="sm" color="dimmed">
              Register or log in to sync your cards across devices.
            </Text>
          </Paper>
        )}

        {/* Last used card for quick access */}
        {lastUsedCard && (
          <Box mt="lg" w="100%">
            <Group justify="space-between" mb="xs">
              <Text fw={600} size="lg">
                Aktywna karta
              </Text>
              <Divider w="60%" />
            </Group>
            <Link
              to={`/cards/${lastUsedCard.id}`}
              style={{ textDecoration: "none" }}
            >
              <Paper p="sm" shadow="xs">
                <Header />
              </Paper>
            </Link>
          </Box>
        )}

        {/* Recent cards section */}
        {recentCards.length > 0 && (
          <Box mt="md" w="100%">
            <Group justify="space-between" mb="xs">
              <Text fw={600} size="lg">
                Ostatnie karty
              </Text>
              <Divider w="60%" />
            </Group>
            <Stack gap="xs">
              {recentCards.map((card) => (
                <Paper
                  key={card.id}
                  p="sm"
                  radius="md"
                  withBorder
                  onClick={() => navigate(`/cards/${card.id}`)}
                  style={{ cursor: "pointer" }}
                  shadow="xs"
                >
                  <Text fw={700}>{card.cardInfo.name}</Text>
                  <Text size="sm" c="dimmed">
                    {card.cardInfo.date} | Auto #{card.cardInfo.carNumber}
                  </Text>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        <Button
          size="lg"
          fullWidth
          color="green"
          onClick={() => navigate("/cards")}
        >
          Wszystkie karty
        </Button>
        <Button
          size="lg"
          fullWidth
          color="blue"
          onClick={() => navigate("/create")}
        >
          Utwórz nową kartę
        </Button>
      </Stack>
    </Container>
  );
};
