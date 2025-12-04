import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <h2>🚀 Crypto Tracker</h2>
      </div>
      
      <div style={styles.navLinks}>
        {isAuthenticated ? (
          <>
            <span style={styles.welcome}>Welcome, {user?.username}!</span>
            <button onClick={logout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <span>Please login to track cryptos</span>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1a1a1a',
    color: 'white',
    borderBottom: '2px solid #333',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  welcome: {
    color: '#00d4aa',
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Navbar;