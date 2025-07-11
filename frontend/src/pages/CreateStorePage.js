import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import storeService from '../services/storeService';

const CreateStorePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await storeService.createStore({ name, email, address });
      // On success, navigate to the new store's detail page
      navigate(`/stores/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h1>Create a New Store</h1>
      <form onSubmit={handleSubmit} style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name">Store Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Contact Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="address">Address</label>
          <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Creating...' : 'Create Store'}
        </button>
      </form>
    </div>
  );
};

export default CreateStorePage;