import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { CardPage } from './pages/Card';
import { CardCreatePage } from './pages/CardCreate';
import { CardProvider } from './contexts/CardContext.tsx';

function App() {
  return (
    <CardProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/card" element={<CardPage />} />
          <Route path="/create" element={<CardCreatePage />} />
        </Routes>
      </HashRouter>
    </CardProvider>
  );
}

export default App;
