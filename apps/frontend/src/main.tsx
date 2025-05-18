import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeServiceWorker } from "./serviceWorkerRegistration";

// Initialize service worker for PWA functionality
// This will manage cache refreshes after deployments
initializeServiceWorker();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
