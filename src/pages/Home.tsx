import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

export const HomePage: FunctionComponent = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <h1>Welcome to KJS Buddy</h1>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <Link to="/create">
          <button 
            style={{
              padding: '10px 20px',
              fontSize: '18px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '200px'
            }}
          >
            Create New Card
          </button>
        </Link>
        
        <Link to="/card">
          <button 
            style={{
              padding: '10px 20px',
              fontSize: '18px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '200px'
            }}
          >
            View Current Card
          </button>
        </Link>
      </div>
    </div>
  );
};