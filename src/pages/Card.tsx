import { FunctionComponent } from 'react';
import { Card as CardComponent } from '../components/Card';
import { useOffline } from '../hooks/offline';
import { AskNotificationBar } from '../components/AskNotificationBar';
import { WakeLock } from '../components/WakeLock';
import { Countdown } from '../components/Countdown';

export const CardPage: FunctionComponent = () => {
  const isOffline = useOffline();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: '5rem',
    }}>
      <CardComponent />
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