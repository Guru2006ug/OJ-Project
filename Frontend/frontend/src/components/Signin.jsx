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
    <div className="min-h-screen flex items-center justify-center bg-hero-gradient dark:bg-dark-gradient relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 float"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 float-delayed"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md px-6">
        <form onSubmit={handleSubmit} className="form-modern animate-slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h2>
            <p className="text-gray-600 dark:text-gray-300">Sign in to your account to continue</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input 
                id="email"
                name="email" 
                type="email" 
                placeholder="Enter your email" 
                value={form.email} 
                onChange={handleChange} 
                className="input-modern w-full"
                required 
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input 
                id="password"
                name="password" 
                type="password" 
                placeholder="Enter your password" 
                value={form.password} 
                onChange={handleChange} 
                className="input-modern w-full"
                required 
              />
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-slide-up">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-slide-up">
              <div className="flex">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            className="w-full mt-8 btn-primary disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            disabled={loading}
          >
            <span className={`transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}>
              Sign In
            </span>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
              </div>
            )}
          </button>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?{' '}
              <a href="/signup" className="font-medium text-primary hover:text-secondary transition-colors duration-300 hover:underline">
                Sign up here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin; 