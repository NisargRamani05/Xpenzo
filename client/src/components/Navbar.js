import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext); // Get user for welcome message

  // Links to show when a user is logged in
 const authLinks = (
    <div className="flex items-center gap-4">
      {/* {user && <span className="text-gray-600">Welcome, {user.name}!</span>} */}
      <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>

      {/* --- ADD THIS CONDITIONAL LINK --- */}
      {(user?.role === 'Admin' || user?.role === 'Manager') && (
        <Link to="/directory" className="text-gray-600 hover:text-blue-600">Directory</Link>
      )}

      <Link to="/profile" className="text-gray-600 hover:text-blue-600">Profile</Link>
      <button onClick={logout} className="bg-transparent border-none cursor-pointer text-blue-600 hover:text-blue-800 font-semibold">
        Logout
      </button>
    </div>
  );

  // Links to show when no one is logged in
  const guestLinks = (
    <div className="flex items-center gap-4">
      <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
      <Link 
        to="/signup" 
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Sign Up
      </Link>
    </div>
  );

  return (
    // Converted all inline styles to Tailwind classes
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link to="/" className="text-2xl font-bold text-gray-800">ExpenseManager</Link>
        <div>
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;