
import { Card } from './components/Card.tsx';
import { useOffline } from './hooks/offline.ts';
import { Countdown } from './components/Countdown.tsx';

function App () {
    const isOffline = useOffline()

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: '5rem',
        }}>
            <Card />
            {isOffline && <div style={{
                padding: '1rem',
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '1rem',
            }}>
                Brak połączenia z internetem
            </div>}
            <Countdown />
        </div>
    )
}

export default App
