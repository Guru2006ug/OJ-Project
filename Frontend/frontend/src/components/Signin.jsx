import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Signin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('/api/auth/login', form, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Login response:', response.data); // For debugging
      
      const { token, message, user } = response.data;
      
      // Login successful - token will be in both cookie and response
      login(token); // This will store in localStorage as backup
      setSuccess(message || 'Login successful!');
      navigate('/problems');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary dark:from-dark dark:to-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary dark:text-white">Sign In</h2>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="mb-4 px-4 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-primary" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="mb-4 px-4 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-primary" required />
        {error && <div className="mb-2 text-red-500 text-sm text-center">{error}</div>}
        {success && <div className="mb-2 text-green-500 text-sm text-center">{success}</div>}
        <button type="submit" className="w-full py-2 bg-primary text-white rounded hover:bg-secondary transition-colors font-semibold disabled:opacity-50" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Don't have an account? <a href="/signup" className="text-primary hover:underline">Sign Up</a>
        </div>
      </form>
    </div>
  );
};

export default Signin; 