import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client side validation
    if (formData.username.trim().length < 3) {
      setMessage('Username must be at least 3 characters');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    setMessage('');

    const result = await register(formData.username, formData.email, formData.password);

    if (result.success) {
      setMessage('Registration successful! Redirecting...');
    } else {
      setMessage(result.error);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.headerMB}>Join Crypto Tracker</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={styles.input}
        />
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      {message && (
        <p style={message.includes('successful') ? styles.success : styles.error}>
          {message}
        </p>
      )}
      
      <p style={styles.switchText}>
        Already have an account?{' '}
        <span 
          style={styles.switchLink} 
          onClick={onSwitchToLogin}
        >
          Login here
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

export default Register;