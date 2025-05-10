import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TbLogin } from 'react-icons/tb';
import styles from './Login.module.css';
import { FormField, ErrorMessage } from '../components/FormField';
import { TextLink } from '../components/TextLink';
import { Panel } from '../components/Panel';
import { Button } from '../components/Button';

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
    <div className={styles.container}>
      
      <Panel>
        <form onSubmit={handleSubmit}>
          <div className={styles.formContainer}>            {error && (
              <ErrorMessage title="Authentication Error">
                {error}
              </ErrorMessage>
            )}
            
            <FormField
              label="Email"
              type="email"
              placeholder="Address email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <FormField
              label="Hasło"
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
              <Button
              type="submit"
              disabled={isSubmitting}
              primary
            >
              
              <TbLogin size={20} />
              <span>{isSubmitting ? 'Loguje...' : 'Zaloguj się'}</span>
            </Button>
          </div>
        </form>
      </Panel>
        <div className={styles.footer}>
        <p className={styles.footerText}>
          Nie masz konta?{' '}
          <TextLink onClick={() => navigate('/register')}>
            Zarejestruj się
          </TextLink>
        </p>
      </div>
    </div>
  );
};