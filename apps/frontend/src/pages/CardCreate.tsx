import { FunctionComponent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardContext } from '../contexts/CardContext';
import { useCardsStore } from '../contexts/CardsStoreContext';
import { CardInfo, CardPanel } from '../types/Card';
import monte from "../assets/montecalvaria.png";
import pzm from "../assets/pzmot.png";
import { TbSquareRoundedChevronLeft, TbPlus } from "react-icons/tb";
import { usePredefinedCards } from '../hooks/usePredefinedCards';
import {
  Container, 
  Title,
  Text,
  Button,
  SimpleGrid,
  Paper,
  Group,
  Box,
  TextInput,
  NumberInput,
  Stack,
  ActionIcon,
  Card,
  Grid,
  Badge,
  List
} from '@mantine/core';
import { PredefinedCard } from '../types/Responses';

type CardCreationMode = 'blank' | 'template' | 'details';

export const CardCreatePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { updateCardInfo, updatePanels } = useCardContext();
  const { saveCard } = useCardsStore();
  const { predefinedCards, loading: loadingTemplates } = usePredefinedCards();
  
  // Track creation mode (selecting template or entering details)
  const [creationMode, setCreationMode] = useState<CardCreationMode>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<PredefinedCard | null>(null);
  
  // Default values for the card info
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    name: '',
    cardNumber: 1,
    carNumber: 1,
    date: new Date().toISOString().split('T')[0],
    logo: monte,
    sponsorLogo: pzm,
  });
  
  // Default single panel to start with
  const [panelCount, setPanelCount] = useState(1);
  
  useEffect(() => {
    if (selectedTemplate) {
      // Ensure panels array exists and set panel count
      const panelsCount = Array.isArray(selectedTemplate.panels) ? selectedTemplate.panels.length : 1;
      setPanelCount(panelsCount);
    }
  }, [selectedTemplate]);
  
  const handleCardInfoChange = (name: string, value: string | number) => {
    setCardInfo({
      ...cardInfo,
      [name]: value,
    });
  };
  
  const handleTemplateSelect = (template: PredefinedCard) => {
    setSelectedTemplate(template);
    // Update cardInfo using template properties directly since cardInfo is no longer a nested property
    setCardInfo({
      name: template.name,
      cardNumber: template.cardNumber,
      carNumber: template.carNumber,
      date: template.date,
      logo: template.logo || monte,
      sponsorLogo: template.sponsorLogo || pzm,
    });
    setPanelCount(template.panels?.length || 1);
    setCreationMode('details');
  };
  
  const handleStartBlank = () => {
    setSelectedTemplate(null);
    setCreationMode('details');
  };
  
  const handleBackToTemplates = () => {
    setCreationMode('template');
  };
  
  const handlePanelCountChange = (value: number | string) => {
    setPanelCount(typeof value === 'number' ? value : parseInt(value) || 1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let panels: CardPanel[] = [];
    
    // Generate panels based on the panel count
    for (let i = 1; i <= panelCount; i++) {
      panels.push({
        number: i,
        name: i === 1 ? '' : `PS${i-1}`,
        finishTime: 0,
        provisionalStartTime: i === 1 ? 34200000 : 0, // 9:30 AM in milliseconds
        actualStartTime: i === 1 ? 34200000 : 0,
        drivingTime: 0,
        resultTime: 0,
        nextPKCTime: 0,
        arrivalTime: 0,
      });
    }
    
    // Update card info and panels in context
    updateCardInfo(cardInfo);
    updatePanels(panels);
    
    // Save to the cards store
    saveCard(cardInfo, panels).then(({id}) => {
      // Navigate to the card view after saving
      navigate(`/cards/${id}`);
    });
  };

  // Template selection screen
  if (creationMode === 'template') {
    return (
      <Container size="lg" py="xl">
        <Group justify="space-between" mb="lg">
          <Button
            leftSection={<TbSquareRoundedChevronLeft size={20} />}
            variant="default"
            onClick={() => navigate('/')}
          >
            Powrót do strony głównej
          </Button>
          <Title order={2}>Utwórz nową kartę</Title>
        </Group>
        
        <Box mb="xl">
          <Title order={3}>Wybierz szablon</Title>
          <Text c="dimmed">Rozpocznij od predefiniowanego szablonu lub utwórz od podstaw.</Text>
        </Box>
        
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          {/* Blank card option */}
          <Card 
            withBorder 
            padding="lg"
            shadow="sm"
            radius="md"
            onClick={handleStartBlank}
          >
            <Card.Section py="xl">
              <Stack align="center">
                <ActionIcon 
                  variant="light" 
                  radius="xl" 
                  size="xl" 
                  color="gray"
                >
                  <TbPlus size={24} />
                </ActionIcon>
              </Stack>
            </Card.Section>
            <Stack align="center">
              <Text fw={700}>Pusta karta</Text>
              <Text size="sm" c="dimmed" ta="center">
                Zacznij od pustej karty
              </Text>
            </Stack>
          </Card>
          
          {/* Predefined templates */}
          {loadingTemplates ? (
            <Paper withBorder p="xl" radius="md">
              <Text ta="center">Ładowanie szablonów...</Text>
            </Paper>
          ) : (
            predefinedCards.map(template => (
              <Card 
                key={template.id}
                withBorder 
                padding="lg"
                shadow="sm"
                radius="md"
                onClick={() => handleTemplateSelect(template)}
              >
                <Title order={4} mb="xs">{template.name}</Title>
                <Text size="sm" c="dimmed" mb="lg">{template.description}</Text>
                <Group justify="space-between" mt="auto">
                  <Badge variant="light">Etapy: {template.panels?.length || 0}</Badge>
                </Group>
              </Card>
            ))
          )}
        </SimpleGrid>
      </Container>
    );
  }
  
  // Card details form (either blank or pre-filled from template)
  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="lg">
        <Button
          leftSection={<TbSquareRoundedChevronLeft size={20} />}
          onClick={handleBackToTemplates}
        >
          Powrót do szablonów
        </Button>
        <Title order={2}>
          {selectedTemplate ? `Tworzenie karty ${selectedTemplate.name}` : 'Tworzenie nowej karty'}
        </Title>
      </Group>
      
      <form onSubmit={handleSubmit}>
        <Paper withBorder p="md" radius="md" mb="xl" w="100%">
          <Title order={3} mb="md">Informacje o karcie</Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Nazwa wydarzenia"
                id="name"
                name="name"
                value={cardInfo.name}
                onChange={(e) => handleCardInfoChange('name', e.target.value)}
                required
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Data wydarzenia"
                type="date"
                id="date"
                name="date"
                value={cardInfo.date}
                onChange={(e) => handleCardInfoChange('date', e.target.value)}
                required
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <NumberInput
                label="Numer karty"
                id="cardNumber"
                name="cardNumber"
                value={cardInfo.cardNumber}
                onChange={(value) => handleCardInfoChange('cardNumber', value || 1)}
                min={1}
                required
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <NumberInput
                label="Numer auta"
                id="carNumber"
                name="carNumber"
                value={cardInfo.carNumber}
                onChange={(value) => handleCardInfoChange('carNumber', value || 1)}
                min={1}
                required
              />
            </Grid.Col>
          </Grid>
        </Paper>
        
        <Paper withBorder p="md" radius="md" mb="xl">
          <Title order={3} mb="md">Etapy</Title>
          <NumberInput
            label="Liczba paneli (punkty PKC)"
            id="panelCount"
            value={panelCount}
            onChange={handlePanelCountChange}
            min={1}
            max={10}
            mb="md"
          />
          
          {selectedTemplate && selectedTemplate.panels && (
            <Box mt="md">
              <Text mb="sm">
                {panelCount > selectedTemplate.panels.length 
                  ? `Dodano ${panelCount - selectedTemplate.panels.length} dodatkowych paneli do szablonu.` 
                  : panelCount < selectedTemplate.panels.length
                    ? `Usunięto ${selectedTemplate.panels.length - panelCount} paneli z szablonu.`
                    : 'Używanie paneli zgodnie z szablonem.'}
              </Text>
              <Paper withBorder p="xs" bg="gray.0">
                <List spacing="xs">
                  {Array.from({length: Math.min(panelCount, selectedTemplate.panels.length)}).map((_, index) => (
                    <List.Item key={index}>
                      <Group justify="space-between">
                        <Text>PKC{index + 1}: <Text span fw={700}>{index === 0 ? 'Start' : `PS${index}`}</Text></Text>
                      </Group>
                    </List.Item>
                  ))}
                  {panelCount > selectedTemplate.panels.length && (
                    <List.Item>
                      <Text ta="center" c="dimmed" fs="italic">
                        + {panelCount - selectedTemplate.panels.length} dodatkowych paneli zostanie wygenerowanych
                      </Text>
                    </List.Item>
                  )}
                </List>
              </Paper>
            </Box>
          )}
        </Paper>
        
        <Group justify="space-between">
          <Button 
            variant="outline"
            onClick={handleBackToTemplates}
          >
            Wstecz
          </Button>
          
          <Button 
            type="submit" 
            color="blue"
          >
            Utwórz kartę
          </Button>
        </Group>
      </form>
    </Container>
  );
};