import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Title,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Group,
  Stack,
  Alert,
  Anchor,
} from '@mantine/core';
import { TbAlertCircle, TbLogin } from 'react-icons/tb';

export const LoginPage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container size="sm" py="xl">
      <Title ta="center" mb="lg">
        Log in to KJS Buddy
      </Title>
      
      <Paper p="lg" shadow="md" radius="md" withBorder>
        <form onSubmit={handleSubmit}>
          <Stack>
            {error && (
              <Alert icon={<TbAlertCircle />} title="Authentication Error" color="red">
                {error}
              </Alert>
            )}
            
            <TextInput
              label="Email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <PasswordInput
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Button 
              fullWidth 
              type="submit" 
              loading={isSubmitting}
              leftSection={<TbLogin size={20} />}
            >
              Log In
            </Button>
          </Stack>
        </form>
      </Paper>
      
      <Group justify="center" mt="md">
        <Text size="sm">
          Don't have an account yet?{' '}
          <Anchor component="button" onClick={() => navigate('/register')} fw={500}>
            Register
          </Anchor>
        </Text>
      </Group>
    </Container>
  );
};