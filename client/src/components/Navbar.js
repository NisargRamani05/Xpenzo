import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  const authLinks = (
    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
      <Link to="/dashboard">Dashboard</Link>
      <button onClick={logout} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#007bff'}}>Logout</button>
    </div>
  );

  const guestLinks = (
    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
      <Link to="/login">Login</Link>
      <Link to="/signup" style={{backgroundColor: '#007bff', color: 'white', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none'}}>Sign Up</Link>
    </div>
  );

  return (
    <nav style={{backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
      <div className="container" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 20px'}}>
        <Link to="/" style={{fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#333'}}>ExpenseManager</Link>
        {isAuthenticated ? authLinks : guestLinks}
      </div>
    </nav>
  );
};

export default Navbar;