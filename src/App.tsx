import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { CardPage } from './pages/Card';
import { CardCreatePage } from './pages/CardCreate';
import { CardsStoreProvider } from './contexts/CardsStoreContext';
import { CardProvider } from './contexts/CardContext';
import { CardsListPage } from './pages/CardsList';

function App() {
  return (
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
  );
}

export default App;
