import React, { useState, useEffect } from 'react';
import { cryptoAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, removeFromLocalWatchlist } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWatchlist();
    }
  }, [isAuthenticated]);

  const fetchWatchlist = async () => {
    try {
      const response = await cryptoAPI.getWatchlist();
      setWatchlist(response.data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (coinId) => {
    try {
      await cryptoAPI.removeFromWatchlist(coinId);
      setWatchlist(watchlist.filter(coin => coin.id !== coinId));
      removeFromLocalWatchlist(coinId);
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <h3>⭐ Watchlist</h3>
        <p style={styles.loginMessage}>Please login to manage your watchlist</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <h3>⭐ Watchlist</h3>
        <p>Loading your watchlist...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h3>⭐ Your Watchlist</h3>
        <span style={styles.count}>{watchlist.length} coins</span>
      </header>

      {watchlist.length === 0 ? (
        <div style={styles.empty}>
          <p>Your watchlist is empty</p>
          <p style={styles.emptySubtext}>
            Add coins from the main list to track them here
          </p>
        </div>
      ) : (
        <main style={styles.watchlist}>
          {watchlist.map((coin) => (
            <div key={coin.id} style={styles.watchlistItem}>
              <div style={styles.coinHeader}>
                <img 
                  src={coin.image} 
                  alt={coin.name}
                  style={styles.coinImage}
                />
                <div style={styles.coinInfo}>
                  <div style={styles.coinName}>{coin.name}</div>
                  <div style={styles.coinSymbol}>
                    {coin.symbol.toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div style={styles.coinPrice}>
                <div style={styles.currentPrice}>
                  ${coin.current_price.toLocaleString()}
                </div>
                <div style={{
                  ...styles.priceChange,
                  color: coin.price_change_percentage_24h >= 0 ? '#00d4aa' : '#ff4444'
                }}>
                  {coin.price_change_percentage_24h >= 0 ? '📈' : '📉'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </div>
              </div>

              <button
                onClick={() => removeFromWatchlist(coin.id)}
                style={styles.removeBtn}
                title="Remove from watchlist"
              >
                ❌
              </button>
            </div>
          ))}
        </main>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #333',
    height: 'fit-content',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #333',
  },
  count: {
    backgroundColor: '#00d4aa',
    color: 'black',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  loginMessage: {
    color: '#888',
    textAlign: 'center',
    marginTop: '1rem',
  },
  empty: {
    textAlign: 'center',
    padding: '2rem 1rem',
    color: '#888',
  },
  emptySubtext: {
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
  watchlist: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  watchlistItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    border: '1px solid #333',
  },
  coinHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flex: 1,
  },
  coinImage: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  coinInfo: {
    flex: 1,
  },
  coinName: {
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  coinSymbol: {
    color: '#888',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
  },
  coinPrice: {
    textAlign: 'right',
    marginRight: '1rem',
  },
  currentPrice: {
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  priceChange: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '0.25rem',
    borderRadius: '4px',
  },
};

export default Watchlist;