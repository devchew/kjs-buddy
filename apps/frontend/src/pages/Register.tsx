import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
    <div style={{ 
      maxWidth: '480px', 
      margin: '0 auto', 
      padding: '2rem 1rem' 
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '1.5rem' 
      }}>
        Create an Account
      </h1>
      
      <div style={{ 
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        backgroundColor: 'white'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div style={{ 
                backgroundColor: '#fee2e2', 
                color: '#b91c1c',
                padding: '12px', 
                borderRadius: '6px',
                border: '1px solid #fecaca'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <TbAlertCircle />
                  <strong>Registration Error</strong>
                </div>
                {error}
              </div>
            )}
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: 500 
              }}>
                Email
              </label>
              <input 
                type="email"
                style={{ 
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  fontSize: '1rem'
                }}
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px',
                fontWeight: 500
              }}>
                Password
              </label>
              <input 
                type="password"
                style={{ 
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  fontSize: '1rem'
                }}
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px',
                fontWeight: 500
              }}>
                Confirm Password
              </label>
              <input 
                type="password"
                style={{ 
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  fontSize: '1rem'
                }}
                placeholder="Confirm your password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '10px 16px',
                backgroundColor: '#228be6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '1rem',
                marginTop: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
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
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <TbUserPlus size={20} />
                  <span>Register</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '1rem'
      }}>
        <p style={{ fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')} 
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: '#228be6',
              fontWeight: 500,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.875rem'
            }}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};