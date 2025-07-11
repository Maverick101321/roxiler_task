import React, { useState } from 'react';
import storeService from '../services/storeService';

const AddRatingForm = ({ storeId, onRatingAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment) {
      setError('Please leave a comment.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await storeService.addRating(storeId, { rating, comment });
      onRatingAdded(); // Notify parent to refresh data
      setComment('');
      setRating(5);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Leave a Review</h3>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="rating">Rating</label>
          <select id="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ width: '100%', padding: '8px', marginTop: '4px' }}>
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Good</option>
            <option value={3}>3 - Average</option>
            <option value={2}>2 - Fair</option>
            <option value={1}>1 - Poor</option>
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="comment">Comment</label>
          <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px', minHeight: '80px' }} />
        </div>
        <button type="submit" disabled={submitting} style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default AddRatingForm;