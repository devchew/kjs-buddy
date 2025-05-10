import { FunctionComponent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            <TbArrowLeft size={20} />
            Go back
          </button>
          <h2>Profile</h2>
        </div>
        
        <div style={{
          backgroundColor: '#fff9db',
          border: '1px solid #ffd43b',
          borderRadius: '8px',
          padding: '1rem',
          color: '#e67700'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <TbAlertCircle />
            <strong>Not Logged In</strong>
          </div>
          <p style={{ marginBottom: '1rem' }}>You need to log in to view your profile.</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => navigate('/login')} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#228be6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <TbLogin size={20} />
              Log in
            </button>
            <button 
              onClick={() => navigate('/register')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#e7f5ff',
                color: '#228be6',
                border: '1px solid #74c0fc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          <TbArrowLeft size={20} />
          Go back
        </button>
        <h2>My Profile</h2>
      </div>
      
      <div style={{
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        backgroundColor: 'white'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Account Information</h3>
              <p style={{ margin: 0 }}><strong>Email:</strong> {user?.email}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <p style={{ margin: 0 }}><strong>Role:</strong></p>
                <span style={{
                  backgroundColor: user?.role === 'admin' ? '#ffe3e3' : '#e7f5ff',
                  color: user?.role === 'admin' ? '#c92a2a' : '#1971c2', 
                  padding: '2px 8px',
                  borderRadius: '16px',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  {user?.role || 'user'}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#fff5f5',
              color: '#e03131',
              border: '1px solid #ffc9c9',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            <TbLogout size={20} />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};