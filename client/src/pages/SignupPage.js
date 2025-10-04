import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const { signup } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    password: '',
  });

  const { companyName, name, email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#073737]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#F5F3E9] rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-[#073737]">
          Create Your Company Account
        </h2>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* --- Company Name Input --- */}
          <div>
            <label
              htmlFor="companyName"
              // Text color updated
              className="block mb-2 text-sm font-medium text-[#073737]"
            >
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              name="companyName"
              value={companyName}
              onChange={onChange}
              required
              // Focus ring color updated to the new main color
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#073737] focus:border-[#073737]"
            />
          </div>
          {/* --- Your Name Input --- */}
          <div>
            <label
              htmlFor="name"
              // Text color updated
              className="block mb-2 text-sm font-medium text-[#073737]"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              // Focus ring color updated
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#073737] focus:border-[#073737]"
            />
          </div>
          {/* --- Email Input --- */}
          <div>
            <label
              htmlFor="email"
              // Text color updated
              className="block mb-2 text-sm font-medium text-[#073737]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              // Focus ring color updated
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#073737] focus:border-[#073737]"
            />
          </div>
          {/* --- Password Input --- */}
          <div>
            <label
              htmlFor="password"
              // Text color updated
              className="block mb-2 text-sm font-medium text-[#073737]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              // Focus ring color updated
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#073737] focus:border-[#073737]"
            />
          </div>
          {/* --- Submit Button --- */}
          <button
            type="submit"
            // Button color updated to the new main color
            className="w-full px-4 py-2 text-sm font-medium text-white bg-[#073737] border border-transparent rounded-md shadow-sm hover:bg-[#0a4f4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#073737]"
          >
            Sign Up
          </button>
        </form>
        {/* --- Link to Login Page --- */}
        <p className="text-sm text-center text-[#073737]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold underline hover:text-teal-800">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;