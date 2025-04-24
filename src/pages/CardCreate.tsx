import { FunctionComponent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardContext } from '../contexts/CardContext';
import { useCardsStore } from '../contexts/CardsStoreContext';
import { CardInfo, CardPanel } from '../types/Event';
import monte from "../assets/montecalvaria.png";
import pzm from "../assets/pzmot.png";
import { TbSquareRoundedChevronLeft, TbPlus } from "react-icons/tb";
import { usePredefinedCards } from '../hooks/usePredefinedCards';
import { PredefinedCard } from '../types/PredefinedCards';
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
      setPanelCount(selectedTemplate.panelCount);
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
    setCardInfo(template.cardInfo);
    setPanelCount(template.panelCount);
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
    
    // If a template with specific panel configurations is selected, use those as a base
    if (selectedTemplate && selectedTemplate.panels) {
      const templatePanels = [...selectedTemplate.panels];
      
      // If user wants more panels than template provides, add additional ones
      if (panelCount > templatePanels.length) {
        const lastPanel = templatePanels[templatePanels.length - 1];
        const baseTime = lastPanel.provisionalStartTime || lastPanel.actualStartTime || 34200000;
        const baseDrivingTime = lastPanel.drivingTime || selectedTemplate.panelTemplate.drivingTime || 0;
        
        // Get the naming pattern from the template
        const nameBase = selectedTemplate.panelTemplate.name;
        
        // Add additional panels
        for (let i = templatePanels.length + 1; i <= panelCount; i++) {
          const additionalTime = baseDrivingTime * (i - templatePanels.length);
          templatePanels.push({
            number: i,
            name: `${nameBase}${i-1} - Additional`,
            finishTime: 0,
            provisionalStartTime: 0,
            actualStartTime: 0,
            drivingTime: baseDrivingTime,
            resultTime: 0,
            nextPKCTime: 0,
            arrivalTime: baseTime + additionalTime,
          });
        }
      } 
      // If user wants fewer panels than template provides, remove some
      else if (panelCount < templatePanels.length) {
        // Keep only the first 'panelCount' panels
        templatePanels.splice(panelCount);
      }
      
      // Ensure panel numbers are sequential and all fields are non-nullable numbers
      panels = templatePanels.map((panel, index) => ({
        ...panel,
        number: index + 1,
        finishTime: panel.finishTime || 0,
        provisionalStartTime: panel.provisionalStartTime || 0,
        actualStartTime: panel.actualStartTime || 0,
        drivingTime: panel.drivingTime || 0,
        resultTime: panel.resultTime || 0,
        nextPKCTime: panel.nextPKCTime || 0,
        arrivalTime: panel.arrivalTime || 0
      }));
    } 
    // Otherwise, generate panels based on the panel count and template if available
    else {
      for (let i = 1; i <= panelCount; i++) {
        panels.push({
          number: i,
          name: i === 1 
            ? '' 
            : selectedTemplate 
              ? `${selectedTemplate.panelTemplate.name}${i-1}` 
              : `PS${i-1}`,
          finishTime: 0,
          provisionalStartTime: i === 1 
            ? (selectedTemplate?.panelTemplate.provisionalStartTime || 34200000) 
            : 0,
          actualStartTime: i === 1 
            ? (selectedTemplate?.panelTemplate.provisionalStartTime || 34200000) 
            : 0,
          drivingTime: selectedTemplate?.panelTemplate.drivingTime || 0,
          resultTime: 0,
          nextPKCTime: 0,
          arrivalTime: 0,
        });
      }
    }
    
    // Update card info and panels in context
    updateCardInfo(cardInfo);
    updatePanels(panels);
    
    // Save to the cards store
    const cardId = saveCard(cardInfo, panels);
    
    // Navigate to the card view
    navigate(`/cards/${cardId}`);
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
            Back to Home
          </Button>
          <Title order={2}>Create New Card</Title>
        </Group>
        
        <Box mb="xl">
          <Title order={3}>Choose a Template</Title>
          <Text c="dimmed">Start with a predefined template or create from scratch.</Text>
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
              <Text fw={700}>Blank Card</Text>
              <Text size="sm" c="dimmed" ta="center">
                Start from scratch with a blank card
              </Text>
            </Stack>
          </Card>
          
          {/* Predefined templates */}
          {loadingTemplates ? (
            <Paper withBorder p="xl" radius="md">
              <Text ta="center">Loading templates...</Text>
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
                  <Badge variant="light">Panels: {template.panelCount}</Badge>
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
          variant="subtle"
          onClick={handleBackToTemplates}
        >
          Back to Templates
        </Button>
        <Title order={2}>
          {selectedTemplate ? `Create ${selectedTemplate.name} Card` : 'Create New Card'}
        </Title>
      </Group>
      
      <form onSubmit={handleSubmit}>
        <Paper withBorder p="md" radius="md" mb="xl" w="100%">
          <Title order={3} mb="md">Card Information</Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Event Name"
                id="name"
                name="name"
                value={cardInfo.name}
                onChange={(e) => handleCardInfoChange('name', e.target.value)}
                required
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Event Date"
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
                label="Card Number"
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
                label="Car Number"
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
          <Title order={3} mb="md">Panels</Title>
          <NumberInput
            label="Number of Panels (PKC points)"
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
                  ? `Added ${panelCount - selectedTemplate.panels.length} extra panels to the template.` 
                  : panelCount < selectedTemplate.panels.length
                    ? `Removed ${selectedTemplate.panels.length - panelCount} panels from the template.`
                    : 'Using template panels as defined.'}
              </Text>
              <Paper withBorder p="xs" bg="gray.0">
                <List spacing="xs">
                  {selectedTemplate.panels.slice(0, Math.min(panelCount, selectedTemplate.panels.length)).map(panel => (
                    <List.Item key={panel.number}>
                      <Group justify="space-between">
                        <Text>PKC{panel.number}: <Text span fw={700}>{panel.name || 'Start'}</Text></Text>
                        {panel.drivingTime > 0 && 
                          <Badge>Driving time: {Math.floor(panel.drivingTime/60000)} min</Badge>}
                      </Group>
                    </List.Item>
                  ))}
                  {panelCount > selectedTemplate.panels.length && (
                    <List.Item>
                      <Text ta="center" c="dimmed" fs="italic">
                        + {panelCount - selectedTemplate.panels.length} additional panels will be generated
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
            Back
          </Button>
          
          <Button 
            type="submit" 
            color="blue"
          >
            Create Card
          </Button>
        </Group>
      </form>
    </Container>
  );
};