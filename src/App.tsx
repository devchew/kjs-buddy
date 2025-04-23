import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { CardPage } from './pages/Card';
import { CardProvider } from './contexts/CardContext.tsx';

function App() {
  return (
    <CardProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/card" element={<CardPage />} />
        </Routes>
      </HashRouter>
    </CardProvider>
  );
}

export default App;
