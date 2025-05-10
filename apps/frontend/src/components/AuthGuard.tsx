import { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const AuthGuard: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login page, but save the attempted URL to redirect back after login
      navigate('/login', { 
        state: { from: location.pathname },
        replace: true
      });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(0, 0, 0, 0.1)',
          borderTopColor: '#228be6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // If authenticated, render the protected component
  return isAuthenticated ? <>{children}</> : null;
};