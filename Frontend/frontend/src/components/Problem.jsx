import React, { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        navigate('/signin');
        return;
      }

      const res = await fetch("/api/problems", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (res.status === 401) {
        navigate('/signin');
        return;
      }
      
      const data = await res.json();
      setProblems(data);
    } catch (err) {
      console.error("Failed to fetch problems", err);
      if (err.response?.status === 401) {
        navigate('/signin');
      }
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const url = isEditing ? `/api/problems/${editingId}` : "/api/problems";
    const method = isEditing ? "PUT" : "POST";
    const token = localStorage.getItem("token");

    if (!token) {
      navigate('/signin');
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
        throw new Error(`HTTP error! status: ${response.status}`);
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
      setSuccess('Problem saved successfully!'); // Moved inside try block
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
      await fetch(`/api/problems/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProblems();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const filteredProblems = problems.filter((p) => p.difficulty === difficulty);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Problem Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded shadow font-semibold"
          >
            + Create
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded shadow font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        {["easy", "medium", "hard"].map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`px-4 py-2 rounded font-medium transition ${
              difficulty === level
                ? "bg-white text-indigo-600"
                : "bg-indigo-400 hover:bg-indigo-500 text-white"
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid gap-4">
        {filteredProblems.map((problem) => {
          const isOwner = problem.user === getCurrentUserId();
          return (
            <div
              key={problem._id}
              className="bg-white text-gray-800 p-4 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-bold text-indigo-700">{problem.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{problem.description}</p>
              <div className="flex gap-3 mt-4">
                {isOwner ? (
                  <>
                    <button
                      onClick={() => handleEdit(problem)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Created by another user</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white text-black p-6 rounded-xl w-[90%] max-w-2xl shadow-lg max-h-[85vh] overflow-y-auto">
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <h2 className="text-xl font-semibold mb-2">
                {isEditing ? "Edit Problem" : "Create Problem"}
              </h2>

              {["title", "description", "inputFormat", "outputFormat", "constraints", "sampleInput", "sampleOutput"].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field}
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              ))}

              <div>
                <label className="block font-semibold mb-1">Hidden Test Cases</label>
                {formData.hiddenTestCases.map((tc, index) => (
                  <div key={index} className="mb-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Input"
                      value={tc.input}
                      onChange={(e) => {
                        const updated = [...formData.hiddenTestCases];
                        updated[index].input = e.target.value;
                        setFormData({ ...formData, hiddenTestCases: updated });
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Expected Output"
                      value={tc.expectedOutput}
                      onChange={(e) => {
                        const updated = [...formData.hiddenTestCases];
                        updated[index].expectedOutput = e.target.value;
                        setFormData({ ...formData, hiddenTestCases: updated });
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...formData.hiddenTestCases];
                        updated.splice(index, 1);
                        setFormData({ ...formData, hiddenTestCases: updated });
                      }}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      ✕
                    </button>
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
                  className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                >
                  + Add Test Case
                </button>
              </div>

              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value.toLowerCase() })
                }
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setIsEditing(false);
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
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                >
                  {isEditing ? "Update" : "Create"}
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