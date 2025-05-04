import { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Center, Loader } from '@mantine/core';

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
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  // If authenticated, render the protected component
  return isAuthenticated ? <>{children}</> : null;
};