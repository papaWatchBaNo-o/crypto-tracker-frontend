import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      setMessage('Login successful! Redirecting...');
    } else {
      setMessage(result.error);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.headerMB}>Login to Crypto Tracker</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      {message && (
        <p style={message.includes('successful') ? styles.success : styles.error}>
          {message}
        </p>
      )}
      
      <p style={styles.switchText}>
        Don't have an account?{' '}
        <span 
          style={styles.switchLink} 
          onClick={onSwitchToRegister}
        >
          Register here
        </span>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    border: '1px solid #333',
  },
  headerMB: {
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #444',
    backgroundColor: '#2a2a2a',
    color: 'white',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#00d4aa',
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  success: {
    color: '#00d4aa',
    textAlign: 'center',
    marginTop: '1rem',
  },
  error: {
    color: '#ff4444',
    textAlign: 'center',
    marginTop: '1rem',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '1rem',
    color: '#888',
  },
  switchLink: {
    color: '#00d4aa',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Login;