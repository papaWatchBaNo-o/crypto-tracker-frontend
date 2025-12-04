import React, { useState } from 'react';
import { cryptoAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CryptoCard = ({ crypto }) => {
  const { isAuthenticated, user, addToLocalWatchlist } = useAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(
    user?.watchlist?.some(w => w.coinId === crypto.id) || false
  );
  const [loading, setLoading] = useState(false);

  const handleAddToWatchlist = async () => {
    if (!isAuthenticated) {
      alert('Please login to add to watchlist');
      return;
    }

    if (isInWatchlist) return;

    setLoading(true);
    try {
      await cryptoAPI.addToWatchlist({
        coinId: crypto.id,
        coinName: crypto.name,
      });
      setIsInWatchlist(true);
      addToLocalWatchlist(crypto.id, crypto.name);
    } catch (error) {
      alert('Failed to add to watchlist');
    } finally {
      setLoading(false);
    }
  };

  const priceChangeColor = crypto.price_change_percentage_24h >= 0 ? '#00d4aa' : '#ff4444';
  const priceChangeIcon = crypto.price_change_percentage_24h >= 0 ? '📈' : '📉';

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.coinInfo}>
          <img 
            src={crypto.image} 
            alt={crypto.name}
            style={styles.coinImage}
          />
          <div>
            <h3 style={styles.coinName}>{crypto.name}</h3>
            <p style={styles.coinSymbol}>{crypto.symbol.toUpperCase()}</p>
          </div>
        </div>
        <div style={styles.rank}>
          #{crypto.market_cap_rank}
        </div>
      </div>

      <div style={styles.priceSection}>
        <div style={styles.currentPrice}>
          ${crypto.current_price.toLocaleString()}
        </div>
        <div style={{ ...styles.priceChange, color: priceChangeColor }}>
          {priceChangeIcon} {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Market Cap:</span>
          <span style={styles.statValue}>
            ${(crypto.market_cap / 1000000000).toFixed(2)}B
          </span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>24h Volume:</span>
          <span style={styles.statValue}>
            ${(crypto.total_volume / 1000000).toFixed(2)}M
          </span>
        </div>
      </div>

      {isAuthenticated && (
        <button
          onClick={handleAddToWatchlist}
          disabled={loading || isInWatchlist}
          style={{
            ...styles.watchlistBtn,
            ...(isInWatchlist ? styles.watchlistBtnAdded : {}),
          }}
        >
          {isInWatchlist ? '✅ In Watchlist' : '⭐ Add to Watchlist'}
        </button>
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #333',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  coinInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  coinImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
  },
  coinName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '0.25rem',
  },
  coinSymbol: {
    color: '#888',
    fontSize: '0.9rem',
  },
  rank: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  priceSection: {
    marginBottom: '1rem',
  },
  currentPrice: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  priceChange: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  stats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  stat: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
  },
  statLabel: {
    color: '#888',
  },
  statValue: {
    fontWeight: 'bold',
  },
  watchlistBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  watchlistBtnAdded: {
    backgroundColor: '#00d4aa',
    color: 'black',
  },
};

export default CryptoCard;