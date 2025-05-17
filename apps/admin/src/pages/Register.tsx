import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TbUserPlus } from 'react-icons/tb';
import styles from './Register.module.css';
import { FormField, ErrorMessage } from '../components/FormField';
import { TextLink } from '../components/TextLink';
import { Panel } from '../components/Panel';
import { Button } from '../components/Button';

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
      setError('Uzupełnij wszystkie pola');
      return;
    }
    
    if (password !== passwordConfirm) {
      setError('Hasła nie pasują do siebie');
      return;
    }
    
    if (password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await register(email, password);
      navigate('/');
    } catch (error) {
      setError('Użytkownik o tym adresie email już istnieje');
    } finally {
      setIsSubmitting(false);
    }
  };
    return (
    <>
      
      <Panel>
        <form onSubmit={handleSubmit}>
          <div className={styles.formContainer}>            {error && (
              <ErrorMessage title="Błąd rejestracji">
                {error}
              </ErrorMessage>
            )}
            
            <FormField
              label="Adres email"
              type="email"
              placeholder="Adres email"
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
            
            <FormField
              label="Potwierdź hasło"
              type="password"
              placeholder="Potwierdź hasło"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
              <Button
              type="submit"
              disabled={isSubmitting}
              primary
            >
              <TbUserPlus size={20} />
              <span>{isSubmitting ? 'Rejestruje...' : 'Zarejestruj się'}</span>
            </Button>
          </div>
        </form>
      </Panel>
        <div className={styles.footer}>
        <p className={styles.footerText}>
          Masz już konto?{' '}
          <TextLink onClick={() => navigate('/login')}>
            Zaloguj się
          </TextLink>
        </p>
      </div>
    </>
  );
};