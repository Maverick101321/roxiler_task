import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome!</h1>
      {user && <p>You are logged in with role: <strong>{user.role}</strong></p>}
      <div style={{ margin: '1rem 0' }}>
        <Link to="/stores">View All Stores</Link>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HomePage;