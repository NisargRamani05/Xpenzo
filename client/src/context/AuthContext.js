import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
        // You would typically have a /api/auth/me endpoint to verify the token
        // and get user data. For the hackathon, we'll decode it on the client.
        // This is NOT secure for production but is fast for a hackathon.
        try {
            // A simple decode, replace with a library like jwt-decode if needed
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser(payload.user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Invalid token:", error);
            logout(); // If token is invalid, log out
        }
    }
    setLoading(false);
  }, [token]);

  const signup = async (formData) => {
    try {
      const res = await api.post('/auth/signup', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
      // TODO: Display error to user
    }
  };

  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
      // TODO: Display error to user
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;