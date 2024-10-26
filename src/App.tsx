import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const useOffline = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine)

    const goOnline = () => setIsOffline(false)
    const goOffline = () => setIsOffline(true)

    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)

    return isOffline
}

function App () {
    const [count, setCount] = useState(0)
    const isOffline = useOffline()

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
            {isOffline && <p className="offline">You are offline</p>}
        </>
    )
}

export default App
