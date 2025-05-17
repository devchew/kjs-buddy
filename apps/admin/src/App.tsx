import "@internal/rally-card/style.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainHeader } from './components/MainHeader.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { CardPage } from './pages/Card';
import { CardCreatePage } from './pages/CardCreate';
import { CardsListPage } from './pages/CardsList.tsx';
import { HomePage } from './pages/Home';
import { LoginPage } from './pages/Login';
import { ProfilePage } from './pages/Profile';
import { RegisterPage } from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainHeader />
        <main className="container">
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
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
