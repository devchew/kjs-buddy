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
import { TbAlertCircle, TbUserPlus } from 'react-icons/tb';

export const RegisterPage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email.trim() || !password.trim() || !passwordConfirm.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await register(email, password);
      navigate('/');
    } catch (error) {
      setError('Registration failed. User may already exist.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container size="sm" py="xl">
      <Title ta="center" mb="lg">
        Create an Account
      </Title>
      
      <Paper p="lg" shadow="md" radius="md" withBorder>
        <form onSubmit={handleSubmit}>
          <Stack>
            {error && (
              <Alert icon={<TbAlertCircle />} title="Registration Error" color="red">
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
              placeholder="Create a password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
            
            <Button 
              fullWidth 
              type="submit" 
              loading={isSubmitting}
              leftSection={<TbUserPlus size={20} />}
            >
              Register
            </Button>
          </Stack>
        </form>
      </Paper>
      
      <Group justify="center" mt="md">
        <Text size="sm">
          Already have an account?{' '}
          <Anchor component="button" onClick={() => navigate('/login')} fw={500}>
            Log in
          </Anchor>
        </Text>
      </Group>
    </Container>
  );
};