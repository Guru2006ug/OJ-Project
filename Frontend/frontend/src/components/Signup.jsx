import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data);
      setSuccess('Registration successful! Please sign in.');
      setTimeout(() => navigate('/signin'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary dark:from-dark dark:to-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary dark:text-white">Sign Up</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input name="firstName" type="text" placeholder="First Name" value={form.firstName} onChange={handleChange} className="col-span-1 px-4 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" required />
          <input name="lastName" type="text" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="col-span-1 px-4 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" required />
        </div>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="mb-4 px-4 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-primary" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="mb-4 px-4 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-primary" required />
        {error && <div className="mb-2 text-red-500 text-sm text-center">{error}</div>}
        {success && <div className="mb-2 text-green-500 text-sm text-center">{success}</div>}
        <button type="submit" className="w-full py-2 bg-primary text-white rounded hover:bg-secondary transition-colors font-semibold disabled:opacity-50" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account? <a href="/signin" className="text-primary hover:underline">Sign In</a>
        </div>
      </form>
    </div>
  );
};

export default Signup; 