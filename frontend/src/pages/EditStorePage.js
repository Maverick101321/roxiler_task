import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import storeService from '../services/storeService';
import { AuthContext } from '../context/AuthContext';

const EditStorePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await storeService.getStore(id);
        const store = response.data;
        // Security check: ensure the user is the owner or an admin
        if (user.role !== 'admin' && user.id !== store.owner_id) {
          navigate('/'); // Redirect if not authorized
          return;
        }
        setFormData({ name: store.name, email: store.email, address: store.address });
      } catch (err) {
        setError('Failed to load store data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [id, user, navigate]);

  const { name, email, address } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await storeService.updateStore(id, { name, email, address });
      navigate(`/stores/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update store.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h1>Edit Store</h1>
      <form onSubmit={handleSubmit} style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: '1rem' }}><label>Store Name</label><input type="text" name="name" value={name} onChange={onChange} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} /></div>
        <div style={{ marginBottom: '1rem' }}><label>Contact Email</label><input type="email" name="email" value={email} onChange={onChange} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} /></div>
        <div style={{ marginBottom: '1rem' }}><label>Address</label><input type="text" name="address" value={address} onChange={onChange} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} /></div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
};

export default EditStorePage;