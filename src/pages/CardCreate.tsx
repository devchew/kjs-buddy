import { FunctionComponent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardContext } from '../contexts/CardContext';
import { useCardsStore } from '../contexts/CardsStoreContext';
import { CardInfo, CardPanel } from '../types/Event';
import monte from "../assets/montecalvaria.png";
import pzm from "../assets/pzmot.png";
import { TbSquareRoundedChevronLeft } from "react-icons/tb";
import { usePredefinedCards } from '../hooks/usePredefinedCards';
import { PredefinedCard } from '../types/PredefinedCards';

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
  
  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo({
      ...cardInfo,
      [name]: name === 'cardNumber' || name === 'carNumber' ? Number(value) : value,
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
  
  const handlePanelCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = Number(e.target.value);
    setPanelCount(newCount);
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
      
      // Ensure panel numbers are sequential
      panels = templatePanels.map((panel, index) => ({
        ...panel,
        number: index + 1
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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          marginBottom: '1rem',
        }}>
          <a 
            onClick={() => navigate('/')} 
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#1b3c83',
              fontWeight: 'bold',
              marginRight: 'auto',
              cursor: 'pointer',
            }}
          >
            <TbSquareRoundedChevronLeft size={24} />
            Back to Home
          </a>
          
          <h1 style={{ margin: 0 }}>Create New Card</h1>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2>Choose a Template</h2>
          <p>Start with a predefined template or create from scratch.</p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {/* Blank card option */}
          <div 
            onClick={handleStartBlank}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: 'pointer',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              transition: 'transform 0.1s, box-shadow 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>+</div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Blank Card</h3>
            <p style={{ margin: 0, textAlign: 'center', color: '#666' }}>
              Start from scratch with a blank card
            </p>
          </div>
          
          {/* Predefined templates */}
          {loadingTemplates ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading templates...</div>
          ) : (
            predefinedCards.map(template => (
              <div 
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  transition: 'transform 0.1s, box-shadow 0.2s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{template.name}</h3>
                <p style={{ margin: '0 0 1rem 0', color: '#666' }}>{template.description}</p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.875rem'
                }}>
                  <span>Panels: {template.panelCount}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
  
  // Card details form (either blank or pre-filled from template)
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: '1rem',
      }}>
        <a 
          onClick={handleBackToTemplates} 
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#1b3c83',
            fontWeight: 'bold',
            marginRight: 'auto',
            cursor: 'pointer',
          }}
        >
          <TbSquareRoundedChevronLeft size={24} />
          Back to Templates
        </a>
        
        <h1 style={{ margin: 0 }}>
          {selectedTemplate ? `Create ${selectedTemplate.name} Card` : 'Create New Card'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2>Card Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="name">Event Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={cardInfo.name}
                onChange={handleCardInfoChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginTop: '0.25rem',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div>
              <label htmlFor="date">Event Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={cardInfo.date}
                onChange={handleCardInfoChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginTop: '0.25rem',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div>
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="number"
                id="cardNumber"
                name="cardNumber"
                value={cardInfo.cardNumber}
                onChange={handleCardInfoChange}
                min="1"
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginTop: '0.25rem',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div>
              <label htmlFor="carNumber">Car Number</label>
              <input
                type="number"
                id="carNumber"
                name="carNumber"
                value={cardInfo.carNumber}
                onChange={handleCardInfoChange}
                min="1"
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginTop: '0.25rem',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2>Panels</h2>
          <div>
            <label htmlFor="panelCount">Number of Panels (PKC points)</label>
            <input
              type="number"
              id="panelCount"
              value={panelCount}
              onChange={handlePanelCountChange}
              min="1"
              max="10"
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                fontSize: '1rem'
              }}
            />
          </div>
          
          {selectedTemplate && selectedTemplate.panels && (
            <div style={{ marginTop: '1rem' }}>
              <p>
                {panelCount > selectedTemplate.panels.length 
                  ? `Added ${panelCount - selectedTemplate.panels.length} extra panels to the template.` 
                  : panelCount < selectedTemplate.panels.length
                    ? `Removed ${selectedTemplate.panels.length - panelCount} panels from the template.`
                    : 'Using template panels as defined.'}
              </p>
              <ul style={{ 
                listStyle: 'none', 
                padding: '0.5rem',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px'
              }}>
                {selectedTemplate.panels.slice(0, Math.min(panelCount, selectedTemplate.panels.length)).map(panel => (
                  <li key={panel.number} style={{ 
                    padding: '0.5rem', 
                    borderBottom: '1px solid #ddd',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>PKC{panel.number}: <strong>{panel.name || 'Start'}</strong></span>
                    {panel.drivingTime > 0 && <span>Driving time: {Math.floor(panel.drivingTime/60000)} min</span>}
                  </li>
                ))}
                {panelCount > selectedTemplate.panels.length && (
                  <li style={{ 
                    padding: '0.5rem', 
                    borderBottom: '1px solid #ddd',
                    display: 'flex',
                    justifyContent: 'center',
                    color: '#666'
                  }}>
                    + {panelCount - selectedTemplate.panels.length} additional panels will be generated
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            type="button" 
            onClick={handleBackToTemplates} 
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Back
          </button>
          
          <button 
            type="submit" 
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Create Card
          </button>
        </div>
      </form>
    </div>
  );
};