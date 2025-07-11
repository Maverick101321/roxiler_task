import React, { useState, useEffect, useContext } from 'react';
import storeService from '../services/storeService';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const StoresListPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        // Our API returns an object like { success, count, data }
        const response = await storeService.getStores();
        setStores(response.data);
      } catch (err) {
        setError('Failed to fetch stores. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  if (loading) return <div>Loading stores...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Available Stores</h1>
        {user && (user.role === 'admin' || user.role === 'store_owner') && (
          <Link to="/create-store" style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            + Create Store
          </Link>
        )}
      </div>
      {stores.length === 0 ? (
        <p>No stores have been added yet.</p>
      ) : (
        stores.map((store) => (
          <Link to={`/stores/${store.id}`} key={store.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', cursor: 'pointer' }}>
              <h2>{store.name}</h2>
              <p>{store.address}</p>
              <p><strong>Average Rating:</strong> {store.average_rating ? `${store.average_rating} / 5` : 'Not yet rated'}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default StoresListPage;