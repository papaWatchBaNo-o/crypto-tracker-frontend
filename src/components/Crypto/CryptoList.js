import React, { useState, useEffect } from 'react';
import { cryptoAPI } from '../../services/api';
import CryptoCard from './CryptoCard';

const CryptoList = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCryptos();
  }, []);

  const fetchCryptos = async () => {
    try {
      const response = await cryptoAPI.getTopCryptos();
      setCryptos(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch cryptocurrency data');
    } finally {
      setLoading(false);
    }
  };

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Loading cryptocurrency data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        <p>{error}</p>
        <button onClick={fetchCryptos} style={styles.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <header style={styles.header}>
        <h2>Top Cryptocurrencies</h2>
        <div style={styles.controls}>
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <button onClick={fetchCryptos} style={styles.refreshBtn}>
            Refresh
          </button>
        </div>
      </header>

      <main style={styles.grid}>
        {filteredCryptos.map((crypto) => (
          <CryptoCard key={crypto.id} crypto={crypto} />
        ))}
      </main>

      {filteredCryptos.length === 0 && (
        <div style={styles.noResults}>
          <p>No cryptocurrencies found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#00d4aa',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    color: '#ff4444',
  },
  retryBtn: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#00d4aa',
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  controls: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  searchInput: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: '#2a2a2a',
    color: 'white',
    minWidth: '250px',
    fontSize: '1rem',
  },
  refreshBtn: {
    padding: '0.75rem 1rem',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  noResults: {
    textAlign: 'center',
    padding: '3rem',
    color: '#888',
    fontSize: '1.1rem',
  },
};

export default CryptoList;