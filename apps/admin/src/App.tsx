import "@internal/rally-card/style.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainHeader } from './components/MainHeader.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { CardPage } from './pages/Card';
import { CardCreatePage } from './pages/CardCreate';
import { CardsListPage } from './pages/CardsList.tsx';
import { HomePage } from './pages/Home';
import { LoginPage } from './pages/Login';
import { ProfilePage } from './pages/Profile';
import { RegisterPage } from './pages/Register';
import { TemplatesListPage } from './pages/TemplatesList';
import { TemplateCreatePage } from './pages/TemplateCreate';
import { TemplateEditPage } from './pages/TemplateEdit';
import { TemplateDetailPage } from './pages/TemplateDetail';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

// Separate component to use auth context after it's provided
function AppRoutes() {
  return (
    <>
      <MainHeader />
      <main className="container">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <CardCreatePage />
            </ProtectedRoute>
          } />
          <Route path="/cards" element={
            <ProtectedRoute>
              <CardsListPage />
            </ProtectedRoute>
          } />
          <Route path="/cards/:id" element={
            <ProtectedRoute>
              <CardPage />
            </ProtectedRoute>
          } />

          {/* Template routes */}
          <Route path="/templates" element={
            <ProtectedRoute>
              <TemplatesListPage />
            </ProtectedRoute>
          } />
          <Route path="/templates/create" element={
            <ProtectedRoute>
              <TemplateCreatePage />
            </ProtectedRoute>
          } />
          <Route path="/templates/:id" element={
            <ProtectedRoute>
              <TemplateDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/templates/edit/:id" element={
            <ProtectedRoute>
              <TemplateEditPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  );
}

export default App;
