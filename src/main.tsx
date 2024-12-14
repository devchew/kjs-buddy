import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CardProvider } from './contexts/CardContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <CardProvider>
        <App />
      </CardProvider>
  </StrictMode>,
)

const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.register("./sw.js", {
                scope: "/",
            });
            if (registration.installing) {
                console.log("Service worker installing");
            } else if (registration.waiting) {
                console.log("Service worker installed");
            } else if (registration.active) {
                console.log("Service worker active");
            }
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
};

if(!import.meta.env.DEV) {
    registerServiceWorker();
}
