
import { Card } from './components/Card.tsx';
import { useOffline } from './hooks/offline.ts';

function App () {
    const isOffline = useOffline()

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
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
        </div>
    )
}

export default App
