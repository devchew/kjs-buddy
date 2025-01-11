
import { Card } from './components/Card.tsx';
import { useOffline } from './hooks/offline.ts';
import { Countdown } from './components/Countdown.tsx';
import { useBroadcast } from './hooks/useBroadcast.ts';
import { AskNotificationBar } from './components/AskNotificationBar.tsx';

function App () {
    const isOffline = useOffline();
    const {postMessage} = useBroadcast();

    const testNotify = () => {
        postMessage('notifiyTest', 'Test notification');
    }

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
            <AskNotificationBar />
            <button onClick={testNotify}>Test notify</button>
            <Countdown />
        </div>
    )
}

export default App
