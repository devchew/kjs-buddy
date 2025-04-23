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
            marginTop: '20px'
          }}
        >
          Go to Card
        </button>
      </Link>
    </div>
  );
};