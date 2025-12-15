import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CryptoProvider } from './context/CryptoContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import CryptoList from './components/Crypto/CryptoList';
import Watchlist from './components/Crypto/WatchList';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState('login');
  const [activeTab, setActiveTab] = useState('all'); 
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); 
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

        {isMobile ? (
          <div style={styles.mobileView}>
            <div style={styles.tabContainer}>
              <button
                style={{
                  ...styles.tabButton,
                  ...(activeTab === 'all' ? styles.activeTab : {})
                }}
                onClick={() => setActiveTab('all')}
              >
                All Coins
              </button>
              <button
                style={{
                  ...styles.tabButton,
                  ...(activeTab === 'watchlist' ? styles.activeTab : {})
                }}
                onClick={() => setActiveTab('watchlist')}
              >
                Watchlist
              </button>
            </div>
            
            <div style={styles.mobileContent}>
              {activeTab === 'all' ? <CryptoList /> : <Watchlist />}
            </div>
          </div>
        ) : (
          <div style={styles.content}>
            <div style={styles.mainContent}>
              <CryptoList />
            </div>
            <div style={styles.sidebar}>
              <Watchlist />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <CryptoProvider>
        <AppContent />
      </CryptoProvider>
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
    height: 'calc(100vh - 7rem)',
    overflowY: 'auto',
  },

  mobileView: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    padding: '0.25rem',
    marginBottom: '1rem',
  },
  tabButton: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#888',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    backgroundColor: '#00d4aa',
    color: '#0a0a0a',
  },
  mobileContent: {
    minHeight: '60vh',
  },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default App;