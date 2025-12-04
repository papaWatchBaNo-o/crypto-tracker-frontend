import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import CryptoList from './components/Crypto/CryptoList';
import Watchlist from './components/Crypto/WatchList';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState('login');

  if (loading) {
    return (
      <Layout>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading Crypto Tracker...</p>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        {authView === 'login' ? (
          <Login onSwitchToRegister={() => setAuthView('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthView('login')} />
        )}
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={styles.dashboard}>
        <div style={styles.header}>
          <h1>🚀 Crypto Tracker</h1>
          <p style={styles.subtitle}>Real-time cryptocurrency prices and tracking</p>
        </div>
        
        <div style={styles.content}>
          <div style={styles.mainContent}>
            <CryptoList />
          </div>
          <div style={styles.sidebar}>
            <Watchlist />
          </div>
        </div>
      </div>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    color: '#00d4aa',
  },
  spinner: {
    border: '4px solid #333',
    borderTop: '4px solid #00d4aa',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  dashboard: {
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  subtitle: {
    color: '#888',
    marginTop: '0.5rem',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '2rem',
    alignItems: 'start',
  },
  mainContent: {
    minWidth: 0,
  },
  sidebar: {
    position: 'sticky',
    top: '5.5rem',
  },
};

export default App;