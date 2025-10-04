import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // Import context
import './AuthForm.css';

const LoginPage = () => {
  const { login } = useContext(AuthContext); // Get the login function
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    login(formData); // Use the login function from context
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login to Your Account</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={password} onChange={onChange} required />
          </div>
          <button type="submit" className="submit-btn">Login</button>
        </form>
        <p style={{textAlign: 'center', marginTop: '1rem'}}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;