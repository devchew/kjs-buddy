import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { CardPage } from './pages/Card';
import { CardCreatePage } from './pages/CardCreate';
import { CardsStoreProvider } from './contexts/CardsStoreContext';
import { CardProvider } from './contexts/CardContext';
// Using full relative path to resolve module
import { CardsListPage } from './pages/CardsList.tsx';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

// Create a custom theme (you can adjust colors to match your desired style)
const theme = createTheme({
  primaryColor: 'blue',
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications />
      <HashRouter>
        <CardsStoreProvider>
          <CardProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/card" element={<CardPage />} />
              <Route path="/create" element={<CardCreatePage />} />
              <Route path="/cards" element={<CardsListPage />} />
              <Route path="/cards/:id" element={<CardPage />} />
            </Routes>
          </CardProvider>
        </CardsStoreProvider>
      </HashRouter>
    </MantineProvider>
  );
}

export default App;
