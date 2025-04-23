import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardContext } from '../contexts/CardContext';
import { CardInfo, CardPanel } from '../types/Event';
import monte from "../assets/montecalvaria.png";
import pzm from "../assets/pzmot.png";

export const CardCreatePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { updateCardInfo, updatePanels } = useCardContext();
  
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
  
  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo({
      ...cardInfo,
      [name]: name === 'cardNumber' || name === 'carNumber' ? Number(value) : value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create panels based on panel count
    const panels: CardPanel[] = [];
    for (let i = 1; i <= panelCount; i++) {
      panels.push({
        number: i,
        name: i === 1 ? '' : `PS${i-1}`,
        finishTime: 0,
        provisionalStartTime: i === 1 ? 34200000 : 0, // Default 9:30 for the first panel
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
    
    // Navigate to the card view
    navigate('/card');
  };

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
      <h1>Create New Card</h1>
      
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
              onChange={(e) => setPanelCount(Number(e.target.value))}
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
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            type="button" 
            onClick={() => navigate('/')} 
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
            Cancel
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