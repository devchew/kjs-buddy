import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { CardPage } from './pages/Card';
import { CardCreatePage } from './pages/CardCreate';
import { CardsStoreProvider } from './contexts/CardsStoreContext';
import { CardProvider } from './contexts/CardContext';
import { CardsListPage } from './pages/CardsList.tsx';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { ProfilePage } from './pages/Profile';
import { AuthProvider } from './contexts/AuthContext';
import { ActionsBottomBar } from './components/ActionsBottomBar.tsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CardsStoreProvider>
          <CardProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Main application routes - accessible without authentication */}
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CardCreatePage />} />
              <Route path="/cards" element={<CardsListPage />} />
              <Route path="/cards/:id" element={<CardPage />} />
            </Routes>
            <ActionsBottomBar />
          </CardProvider>
        </CardsStoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
