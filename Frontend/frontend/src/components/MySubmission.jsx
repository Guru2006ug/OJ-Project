// src/pages/MySubmissions.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import moment from "moment";
import DarkModeToggle from './DarkModeToggle';

const MySubmissions = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [problemTitle, setProblemTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/submissions/${problemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(res.data);
        
        // Fetch problem title if submissions exist
        if (res.data.length > 0) {
          try {
            const problemRes = await api.get(`/api/problems/${problemId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setProblemTitle(problemRes.data.title);
          } catch (err) {
            console.error("Failed to fetch problem title", err);
          }
        }
      } catch (err) {
        console.error("Failed to fetch submissions", err);
        setError('Failed to fetch submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId, token]);

  const getStatusIcon = (isPassed) => {
    return isPassed ? (
      <div className="flex items-center text-green-400">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Passed
      </div>
    ) : (
      <div className="flex items-center text-red-400">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        Failed
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-hero-gradient dark:bg-dark-gradient text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl float"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl float-delayed"></div>
      </div>

      <div className="relative z-10 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
            <div className="animate-slide-up">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => navigate(-1)}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-xl hover:bg-white/20 hover:shadow-glow transform hover:-translate-y-1 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                    My Submissions
                  </h1>
                  {problemTitle && (
                    <p className="text-white/80 text-lg">for "{problemTitle}"</p>
                  )}
                </div>
              </div>
              <p className="text-white/70">Track your coding progress and submission history</p>
            </div>
            
            <div className="flex items-center gap-4">
              <DarkModeToggle />
              {/* Stats */}
              {submissions.length > 0 && (
                <div className="flex gap-4 animate-slide-up" style={{animationDelay: '0.1s'}}>
                  <div className="glass-dark p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-white">{submissions.length}</div>
                    <div className="text-white/70 text-sm">Total</div>
                  </div>
                  <div className="glass-dark p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {submissions.filter(s => s.isPassed).length}
                    </div>
                    <div className="text-white/70 text-sm">Passed</div>
                  </div>
                  <div className="glass-dark p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {submissions.filter(s => !s.isPassed).length}
                    </div>
                    <div className="text-white/70 text-sm">Failed</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
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

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <h3 className="text-xl font-semibold text-white/80">Loading submissions...</h3>
            </div>
          ) : submissions.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 animate-fade-in">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-white/80 mb-2">No submissions yet</h3>
              <p className="text-white/60 mb-6">You haven't submitted any solutions for this problem.</p>
              <button
                onClick={() => navigate(-1)}
                className="btn-primary"
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Go Back to Problem
              </button>
            </div>
          ) : (
            /* Submissions List */
            <div className="space-y-6">
              {submissions.map((submission, index) => (
                <div
                  key={submission._id}
                  className="card-modern p-6 text-gray-800 dark:text-white animate-slide-up hover-lift"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {/* Submission Header */}
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(submission.isPassed)}
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {moment(submission.createdAt).format("MMM DD, YYYY • HH:mm")}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      submission.isPassed 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {submission.isPassed ? 'Accepted' : 'Wrong Answer'}
                    </div>
                  </div>

                  {/* Code Section */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Code Solution
                    </h4>
                    <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm font-mono leading-relaxed">
                        <code>{submission.code}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Output Comparison */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Your Output
                      </h4>
                      <div className={`p-4 rounded-xl border-2 ${
                        submission.isPassed 
                          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                          : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                      }`}>
                        <pre className={`text-sm font-mono whitespace-pre-wrap ${
                          submission.isPassed 
                            ? 'text-green-800 dark:text-green-300' 
                            : 'text-red-800 dark:text-red-300'
                        }`}>
                          {submission.output || 'No output'}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Expected Output
                      </h4>
                      <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl dark:bg-blue-900/20 dark:border-blue-800">
                        <pre className="text-sm font-mono text-blue-800 dark:text-blue-300 whitespace-pre-wrap">
                          {submission.expectedOutput || 'No expected output'}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



export default MySubmissions;
