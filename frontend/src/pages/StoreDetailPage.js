import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import storeService from '../services/storeService';

const StoreDetailPage = () => {
  const { id } = useParams(); // Get store ID from URL
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <div>Loading store details...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!store) return <div>Store not found.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <Link to="/stores">← Back to all stores</Link>
      <div style={{ marginTop: '1rem', border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
        <h1>{store.name}</h1>
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
    </div>
  );
};

export default StoreDetailPage;