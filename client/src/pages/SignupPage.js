import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Import context
import './AuthForm.css';

const SignupPage = () => {
  const { signup } = useContext(AuthContext); // Get the signup function
  const [formData, setFormData] = useState({ companyName: '', name: '', email: '', password: '' });
 
  // ... (useState logic remains the same)
  const { companyName, name, email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const onSubmit = e => {
    e.preventDefault();
    signup(formData); // Use the signup function from context
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create Your Company Account</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input type="text" name="companyName" value={companyName} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Your Name</label>
            <input type="text" name="name" value={name} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={password} onChange={onChange} required />
          </div>
          <button type="submit" className="submit-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;