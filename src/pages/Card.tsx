import { FunctionComponent } from 'react';
import { Card as CardComponent } from '../components/Card';
import { useOffline } from '../hooks/offline';
import { AskNotificationBar } from '../components/AskNotificationBar';
import { WakeLock } from '../components/WakeLock';
import { Countdown } from '../components/Countdown';
import { useCardContext } from '../contexts/CardContext';

export const CardPage: FunctionComponent = () => {
  const isOffline = useOffline();
  const { addPanel } = useCardContext();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: '5rem',
    }}>
      <CardComponent />
      
      <div style={{ margin: '1rem 0' }}>
        <button 
          onClick={addPanel}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#1b3c83',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add New Panel
        </button>
      </div>
      
      {isOffline && <div style={{
        padding: '1rem',
        backgroundColor: 'red',
        color: 'white',
        borderRadius: '1rem',
      }}>
        Brak połączenia z internetem
      </div>}
      <AskNotificationBar />
      <WakeLock />
      <Countdown />
    </div>
  );
};