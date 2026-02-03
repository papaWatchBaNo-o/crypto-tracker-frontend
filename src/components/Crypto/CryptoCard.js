import { useState } from 'react';
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
      if (error.response?.status === 400) {
        // if coin already in watchlistt
        setIsInWatchlist(true);
      } else {
        alert('Failed to add to watchlist');
      }
    } finally {
      setLoading(false);
    }
  };

  const priceChange = crypto.price_change_percentage_24h || 0;
  const priceChangeColor = priceChange >= 0 ? '#00d4aa' : '#ff4444';
  const priceChangeIcon = priceChange >= 0 ? '📈' : '📉';
  const currentPrice = crypto.current_price ? `$${crypto.current_price.toLocaleString()}` : '$--';
  const marketCap = crypto.market_cap ? `$${(crypto.market_cap / 1000000000).toFixed(2)}B` : '--';
  const volume = crypto.total_volume ? `$${(crypto.total_volume / 1000000).toFixed(2)}M` : '--';
  const rank = crypto.market_cap_rank ? `#${crypto.market_cap_rank}` : '#--';

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.coinInfo}>
          <img 
            src={crypto.image || 'https://via.placeholder.com/40'} 
            alt={crypto.name}
            style={styles.coinImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/40';
            }}
          />
          <div>
            <h3 style={styles.coinName}>{crypto.name || 'Unknown Coin'}</h3>
            <p style={styles.coinSymbol}>{(crypto.symbol || '').toUpperCase()}</p>
          </div>
        </div>
        <div style={styles.rank}>
          {rank}
        </div>
      </div>

      <div style={styles.priceSection}>
        <div style={styles.currentPrice}>
          {currentPrice}
        </div>
        <div style={{ ...styles.priceChange, color: priceChangeColor }}>
          {priceChangeIcon} {Math.abs(priceChange).toFixed(2)}%
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Market Cap:</span>
          <span style={styles.statValue}>
            {marketCap}
          </span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>24h Volume:</span>
          <span style={styles.statValue}>
            {volume}
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
            ...(loading ? styles.watchlistBtnLoading : {}),
          }}
        >
          {loading ? 'Adding...' : isInWatchlist ? '✅ In Watchlist' : '⭐ Add to Watchlist'}
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
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    },
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
    minWidth: 0, 
  },
  coinImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0, 
  },
  coinName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '0.25rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '150px',
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
    flexShrink: 0, 
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
    transition: 'all 0.2s ease',
    ':hover:not(:disabled)': {
      backgroundColor: '#444',
    },
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.7,
    },
  },
  watchlistBtnAdded: {
    backgroundColor: '#00d4aa',
    color: 'black',
    ':hover:not(:disabled)': {
      backgroundColor: '#00c39a',
    },
  },
  watchlistBtnLoading: {
    backgroundColor: '#666',
  },
};

export default CryptoCard;