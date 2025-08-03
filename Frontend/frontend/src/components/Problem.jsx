import React, { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';


const API_BASE_URL = 'http://localhost:5000';
// Inside component:




const Problem = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [difficulty, setDifficulty] = useState("easy");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    inputFormat: "",
    outputFormat: "",
    constraints: "",
    sampleInput: "",
    sampleOutput: "",
    difficulty: "easy",
    hiddenTestCases: [
      { input: "", expectedOutput: "" }
    ],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  // Backend API base URL - change this to match your backend server
  

  const token = localStorage.getItem("token");

  
  

  // Get the current user's ID from the JWT token
  const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (e) {
      return null;
    }
  };

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/problems`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (res.status === 401) {
        navigate('/');
        return;
      }
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setProblems(data);
    } catch (err) {
      console.error("Failed to fetch problems", err);
      setError('Failed to fetch problems');
      if (err.response?.status === 401) {
        navigate('/');
      }
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Navigate first, before logout changes isAuthenticated
      navigate('/');
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const url = isEditing ? `${API_BASE_URL}/api/problems/${editingId}` : `${API_BASE_URL}/api/problems`;
    const method = isEditing ? "PUT" : "POST";
    const token = localStorage.getItem("token");

    if (!token) {
      navigate('/');
      return;
    }

    // Remove backend-managed fields from payload
    const {
      _id,        // MongoDB ID (not needed in payload)
      __v,        // version key from MongoDB
      user,       // user is auto-set by backend
      ...cleanData
    } = formData;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(cleanData),
        credentials: 'include'
      });

      if (response.status === 403) {
        throw new Error('You can only update your own problems');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await fetchProblems();

      setIsEditing(false);
      setEditingId(null);
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        inputFormat: "",
        outputFormat: "",
        constraints: "",
        sampleInput: "",
        sampleOutput: "",
        difficulty: "easy",
        hiddenTestCases: [{ input: "", expectedOutput: "" }],
      });
      setSuccess('Problem saved successfully!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error("Failed to save problem", err);
      setError(err.message || 'Failed to save problem');
      return;
    }
  };

  const handleEdit = (problem) => {
    const { _id, __v, user, ...editableFields } = problem;

    setIsEditing(true);
    setEditingId(problem._id); 
    setFormData(editableFields); 
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      setError(''); // Clear any existing errors
      
      console.log('Attempting to delete problem with ID:', id);
      console.log('Using token:', token);
      
      const response = await fetch(`${API_BASE_URL}/api/problems/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('Delete response status:', response.status);

      if (response.status === 401) {
        navigate('/signin');
        return;
      }

      if (response.status === 403) {
        throw new Error('You can only delete your own problems');
      }

      if (!response.ok) {
        // Try to get detailed error message from backend
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData.message || errorData.error || `Failed to delete problem. Status: ${response.status}`);
      }

      // Success - refresh the problems list
      await fetchProblems();
      setSuccess('Problem deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error("Failed to delete - Full error:", err);
      setError(err.message || 'Failed to delete problem');
    }
  };

  const filteredProblems = problems.filter((p) => p.difficulty === difficulty);

  return (
    <div className="min-h-screen bg-hero-gradient dark:bg-dark-gradient text-white">
      <div className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
            <div className="animate-slide-up">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                Problem Dashboard
              </h1>
              <p className="text-white/80 text-lg">Explore coding challenges and test your skills</p>
            </div>
            <div className="flex flex-wrap gap-3 animate-slide-up" style={{animationDelay: '0.1s'}}>
              <button
                onClick={() => setShowForm(true)}
                className="btn-secondary group"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Problem
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-500/30 hover:shadow-glow transform hover:-translate-y-1 transition-all duration-300 group"
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-wrap gap-3 mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
            {["easy", "medium", "hard"].map((level) => {
              const levelCount = problems.filter(p => p.difficulty === level).length;
              return (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                    difficulty === level
                      ? "bg-white text-primary shadow-glow"
                      : "glass-dark hover:bg-white/20 text-white hover:shadow-glow-lg"
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    level === 'easy' ? 'bg-green-500/20 text-green-300' :
                    level === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {levelCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-md animate-slide-up">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-200">{error}</span>
              </div>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl backdrop-blur-md animate-slide-up">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-200">{success}</span>
              </div>
            </div>
          )}

          {/* Problems Grid */}
          <div className="grid gap-6">
            {filteredProblems.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="text-6xl mb-4">🧩</div>
                <h3 className="text-2xl font-bold text-white/80 mb-2">No {difficulty} problems yet</h3>
                <p className="text-white/60">Be the first to create a {difficulty} problem for the community!</p>
              </div>
            ) : (
              filteredProblems.map((problem, index) => {
                const isOwner = problem.user === getCurrentUserId();
                return (
                  <div
                    key={problem._id}
                    className="card-modern p-6 text-gray-800 dark:text-white animate-slide-up hover-lift"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h2 className="text-2xl font-bold text-primary dark:text-secondary">{problem.title}</h2>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            problem.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {problem.difficulty.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{problem.description}</p>
                        {!isOwner && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">Created by another user</p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {isOwner && (
                          <>
                            <button
                              onClick={() => handleEdit(problem)}
                              className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-xl hover:bg-yellow-500/30 hover:shadow-glow transform hover:-translate-y-0.5 transition-all duration-300 font-medium"
                            >
                              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(problem._id)}
                              className="bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/30 hover:shadow-glow transform hover:-translate-y-0.5 transition-all duration-300 font-medium"
                            >
                              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </>
                        )}
                        <Link to={`/solve/${problem._id}`}>
                          <button className="btn-primary">
                            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            Solve
                          </button>
                        </Link>
                        <button
                          onClick={() => navigate(`/my-submissions/${problem._id}`)}
                          className="bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl hover:bg-blue-500/30 hover:shadow-glow transform hover:-translate-y-0.5 transition-all duration-300 font-medium"
                        >
                          <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          My Submissions
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="form-modern w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <form onSubmit={handleCreateOrUpdate} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold gradient-text mb-2">
                  {isEditing ? "Edit Problem" : "Create New Problem"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {isEditing ? "Update problem details" : "Add a new coding challenge for the community"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Problem Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter a descriptive title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="input-modern w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Problem Description
                  </label>
                  <textarea
                    placeholder="Provide a clear and detailed problem description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="input-modern w-full resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Input Format
                  </label>
                  <input
                    type="text"
                    placeholder="Describe the input format"
                    value={formData.inputFormat}
                    onChange={(e) => setFormData({ ...formData, inputFormat: e.target.value })}
                    required
                    className="input-modern w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Output Format
                  </label>
                  <input
                    type="text"
                    placeholder="Describe the expected output format"
                    value={formData.outputFormat}
                    onChange={(e) => setFormData({ ...formData, outputFormat: e.target.value })}
                    required
                    className="input-modern w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Constraints
                  </label>
                  <input
                    type="text"
                    placeholder="Specify any constraints (e.g., 1 ≤ n ≤ 10^5)"
                    value={formData.constraints}
                    onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                    required
                    className="input-modern w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sample Input
                  </label>
                  <textarea
                    placeholder="Provide sample input"
                    value={formData.sampleInput}
                    onChange={(e) => setFormData({ ...formData, sampleInput: e.target.value })}
                    required
                    rows={3}
                    className="input-modern w-full resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sample Output
                  </label>
                  <textarea
                    placeholder="Provide expected output for sample input"
                    value={formData.sampleOutput}
                    onChange={(e) => setFormData({ ...formData, sampleOutput: e.target.value })}
                    required
                    rows={3}
                    className="input-modern w-full resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="input-modern w-full"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Hidden Test Cases
                </label>
                <div className="space-y-4">
                  {formData.hiddenTestCases.map((tc, index) => (
                    <div key={index} className="card-modern p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">Test Case {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.hiddenTestCases];
                            updated.splice(index, 1);
                            setFormData({ ...formData, hiddenTestCases: updated });
                          }}
                          className="bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Input</label>
                          <textarea
                            placeholder="Test case input"
                            value={tc.input}
                            onChange={(e) => {
                              const updated = [...formData.hiddenTestCases];
                              updated[index].input = e.target.value;
                              setFormData({ ...formData, hiddenTestCases: updated });
                            }}
                            rows={3}
                            className="input-modern w-full resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Expected Output</label>
                          <textarea
                            placeholder="Expected output"
                            value={tc.expectedOutput}
                            onChange={(e) => {
                              const updated = [...formData.hiddenTestCases];
                              updated[index].expectedOutput = e.target.value;
                              setFormData({ ...formData, hiddenTestCases: updated });
                            }}
                            rows={3}
                            className="input-modern w-full resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        hiddenTestCases: [...formData.hiddenTestCases, { input: "", expectedOutput: "" }],
                      })
                    }
                    className="w-full p-4 border-2 border-dashed border-primary/30 rounded-xl text-primary dark:text-secondary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 font-medium"
                  >
                    + Add Test Case
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setIsEditing(false);
                    setEditingId(null);
                    setFormData({
                      title: "",
                      description: "",
                      inputFormat: "",
                      outputFormat: "",
                      constraints: "",
                      sampleInput: "",
                      sampleOutput: "",
                      difficulty: "easy",
                      hiddenTestCases: [{ input: "", expectedOutput: "" }],
                    });
                  }}
                  className="flex-1 py-3 px-6 bg-gray-500/20 border border-gray-500/30 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-500/30 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {isEditing ? "Update Problem" : "Create Problem"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Problem;