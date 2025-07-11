import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

const RegistrationPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'normal',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password, address, role } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Register the user
      await authService.register({ name, email, password, address, role });
      // Automatically log them in after successful registration
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: '1rem' }}>
          <label>Full Name</label>
          <input type="text" name="name" value={name} onChange={onChange} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={onChange} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input type="password" name="password" value={password} onChange={onChange} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Address</label>
          <input type="text" name="address" value={address} onChange={onChange} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Register as</label>
          <select name="role" value={role} onChange={onChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}><option value="normal">Normal User</option><option value="store_owner">Store Owner</option></select>
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default RegistrationPage;