import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          StoreRate
        </Link>
        <ul className="nav-menu">
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/stores" className="nav-links">Stores</Link>
              </li>
              <li className="nav-item">
                <span className="nav-links-user">Welcome, {user.name || user.id}</span>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-button">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item"><Link to="/login" className="nav-links">Login</Link></li>
              <li className="nav-item"><Link to="/register" className="nav-links button-primary">Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;