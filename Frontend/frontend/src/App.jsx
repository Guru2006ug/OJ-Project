import HomePage from './components/HomePage'
import Signup from './components/Signup'
import Signin from './components/Signin'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

const UserPage = () => (
  <div className="min-h-screen flex items-center justify-center text-3xl font-bold">Welcome, User!</div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </Router>
  )
}

export default App
