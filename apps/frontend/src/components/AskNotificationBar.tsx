import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { TbBellRinging } from 'react-icons/tb';
import style from './AskNotificationBar.module.css';

const useNotificationPermision = () => {
    const [granted, setGranted] = useState(false);
    const [unsupported, setUnsupported] = useState(false);

    useEffect(() => {
        setGranted(false);
        setUnsupported(false);

        if (!("Notification" in window)) {
            setUnsupported(true);
            setGranted(false);
            return;
        }

        if (Notification.permission === "granted") {
            setGranted(true);
            return;
        }

        setGranted(false);
    }, []);

    const askNotificationPermission = useCallback(() => {
        if (unsupported || granted) {
            return;
        }

        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                setGranted(true);
            }
        });

    }, [unsupported, granted]);


    return { granted, unsupported, askNotificationPermission };
}


export const AskNotificationBar: FunctionComponent = () => {
    const { askNotificationPermission, granted, unsupported } = useNotificationPermision();
    const [hidden, setHidden] = useState(false);

    if (unsupported || granted || hidden) {
        return null;
    }

    return (
        <div 
          style={{ 
            backgroundColor: '#e7f5ff', 
            border: '1px solid #74c0fc',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '1rem',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <TbBellRinging style={{ color: '#339af0' }} />
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#1c7ed6' }}>Powiadomienia</h3>
            <button 
              onClick={() => setHidden(true)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '4px',
                marginLeft: 'auto'
              }}
              aria-label="Zamknij"
            >
              ✕
            </button>
          </div>
          
          <p style={{ marginBottom: '12px' }}>
            Wyślemy Ci powiadomienie, gdy zbliża się czas na kolejne PKC.
          </p>
          
          <button 
            onClick={askNotificationPermission}
            style={{
              backgroundColor: '#1c7ed6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Zezwól na powiadomienia
          </button>
        </div>
    );
}
