import { useState } from 'react'
import { Card } from './components/Card.tsx';

const useOffline = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine)

    const goOnline = () => setIsOffline(false)
    const goOffline = () => setIsOffline(true)

    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)

    return isOffline
}

function App () {
    const isOffline = useOffline()

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
        }}>
            <Card />
            {isOffline && <p className="offline">You are offline</p>}
        </div>
    )
}

export default App
