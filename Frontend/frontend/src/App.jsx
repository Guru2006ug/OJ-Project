import HomePage from './components/HomePage'
import Signup from './components/Signup'
import Signin from './components/Signin'
import Problem from './components/Problem'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'
import './App.css'
import React from "react";
import Compiler from './components/Compiler'
import MySubmissions from './components/MySubmission'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <Signin />
              </PublicRoute>
            }
          />
          <Route
            path="/problems"
            element={
              <ProtectedRoute>
                <Problem />
              </ProtectedRoute>
            }
          />
          <Route path="/solve/:id" element={<Compiler />} />
          <Route path="/my-submissions/:problemId" element={<MySubmissions />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
