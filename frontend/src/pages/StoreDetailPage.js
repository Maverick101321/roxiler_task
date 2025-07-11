import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import storeService from '../services/storeService';
import { AuthContext } from '../context/AuthContext';
import AddRatingForm from '../components/AddRatingForm';

const StoreDetailPage = () => {
  const { id } = useParams(); // Get store ID from URL
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        // Fetch store details and ratings concurrently
        const [storeResponse, ratingsResponse] = await Promise.all([
          storeService.getStore(id),
          storeService.getStoreRatings(id),
        ]);
        setStore(storeResponse.data);
        setRatings(ratingsResponse.data);
      } catch (err) {
        setError('Failed to fetch store details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [id]); // Re-run effect if the store ID changes

  const handleRatingAdded = async () => {
    // Refetch ratings and store details to show the new one and update the average
    const [storeResponse, ratingsResponse] = await Promise.all([storeService.getStore(id), storeService.getStoreRatings(id)]);
    setStore(storeResponse.data);
    setRatings(ratingsResponse.data);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      try {
        await storeService.deleteStore(id);
        navigate('/stores');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete store.');
      }
    }
  };

  if (loading) return <div>Loading store details...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!store) return <div>Store not found.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <Link to="/stores">← Back to all stores</Link>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      <div style={{ marginTop: '1rem', border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h1>{store.name}</h1>
          {user && (user.role === 'admin' || user.id === store.owner_id) && (
            <div>
              <Link to={`/stores/${store.id}/edit`} style={{ marginRight: '10px', textDecoration: 'none', padding: '8px 12px', backgroundColor: '#ffc107', color: 'black', borderRadius: '5px' }}>Edit</Link>
              <button onClick={handleDelete} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
            </div>
          )}
        </div>
        <p>{store.address}</p>
        <p><strong>Email:</strong> {store.email}</p>
        <p><strong>Average Rating:</strong> {store.average_rating ? `${store.average_rating} / 5` : 'Not yet rated'}</p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Ratings & Reviews</h2>
        {ratings.length === 0 ? (
          <p>This store has no reviews yet.</p>
        ) : (
          ratings.map((rating) => (
            <div key={rating.id} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
              <p><strong>Rating: {rating.rating} / 5</strong> by {rating.userName}</p>
              <p><em>"{rating.comment}"</em></p>
              <small>{new Date(rating.created_at).toLocaleDateString()}</small>
            </div>
          ))
        )}
      </div>

      {user && user.role === 'normal' && (
        <AddRatingForm storeId={id} onRatingAdded={handleRatingAdded} />
      )}
    </div>
  );
};

export default StoreDetailPage;