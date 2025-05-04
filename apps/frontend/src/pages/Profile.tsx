import { FunctionComponent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Title,
  Paper,
  Button,
  Group,
  Stack,
  Text,
  Badge,
  Center,
  Alert,
} from '@mantine/core';
import { TbAlertCircle, TbArrowLeft, TbLogin, TbLogout } from 'react-icons/tb';

export const ProfilePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (isLoading) {
    return (
      <Container size="sm" py="xl">
        <Center>
          <Text>Loading...</Text>
        </Center>
      </Container>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <Container size="sm" py="xl">
        <Group justify="space-between" mb="lg">
          <Button
            leftSection={<TbArrowLeft size={20} />}
            variant="default"
            onClick={() => navigate('/')}
          >
            Go back
          </Button>
          <Title order={2}>Profile</Title>
        </Group>
        
        <Alert icon={<TbAlertCircle />} title="Not Logged In" color="yellow">
          <Text mb="md">You need to log in to view your profile.</Text>
          <Group>
            <Button 
              onClick={() => navigate('/login')} 
              leftSection={<TbLogin size={20} />}
            >
              Log in
            </Button>
            <Button 
              variant="light" 
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Group>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container size="sm" py="xl">
      <Group justify="space-between" mb="lg">
        <Button
          leftSection={<TbArrowLeft size={20} />}
          variant="default"
          onClick={() => navigate('/')}
        >
          Go back
        </Button>
        <Title order={2}>My Profile</Title>
      </Group>
      
      <Paper p="lg" shadow="md" radius="md" withBorder>
        <Stack>
          <Group justify="space-between" align="center">
            <Stack gap="xs">
              <Title order={3}>Account Information</Title>
              <Text><strong>Email:</strong> {user?.email}</Text>
              <Group gap="xs">
                <Text><strong>Role:</strong></Text>
                <Badge color={user?.role === 'admin' ? 'red' : 'blue'}>
                  {user?.role || 'user'}
                </Badge>
              </Group>
            </Stack>
          </Group>
          
          <Button
            color="red"
            onClick={handleLogout}
            leftSection={<TbLogout size={20} />}
            variant="light"
            mt="md"
          >
            Log out
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};