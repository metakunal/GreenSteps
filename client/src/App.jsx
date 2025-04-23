import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HabitLogger from './components/HabitLogger';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import LandingPage from './components/LandingPage';
import { Toaster } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [anonymousName, setAnonymousName] = useState('');
  useEffect(() => {
    // Function to generate anonymous name using Web Crypto API
    const generateAnonymousName = async (email) => {
      if (!email) return '';
      
      // Convert email string to array buffer
      const encoder = new TextEncoder();
      const data = encoder.encode(email);
      
      // Generate SHA-256 hash
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      
      // Convert to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Return first 6 characters
      return hashHex.slice(0, 6);
    };
    
    // Call the function and update state
    generateAnonymousName(email).then(name => {
      setAnonymousName(name);
    });
  }, [email]);
  
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setEmail(decoded.email);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  if (!token) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup setToken={setToken} />} />
        </Routes>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🌱</span>
              <h1 className="text-2xl font-bold text-green-800">GreenSteps</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
              <p className="text-gray-600 font-medium">Welcome, <span className="text-green-700">{anonymousName}</span></p>
              <nav className="flex space-x-4">
                <Link 
                  to="/log" 
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-green-50 transition-colors"
                  activeClassName="bg-green-100 text-green-800"
                >
                  Log Habits
                </Link>
                <Link 
                  to="/dashboard" 
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-green-50 transition-colors"
                  activeClassName="bg-green-100 text-green-800"
                >
                  Dashboard
                </Link>
              </nav>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-1"
              >
                <span>Sign Out</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '0.5rem',
              background: '#fff',
              color: '#065f46',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #d1fae5'
            },
          }}
        />
        <Routes>
          <Route path="/log" element={<HabitLogger />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<HabitLogger />} />
        </Routes>
      </main>

      <footer className="bg-white border-t mt-8">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} GreenSteps - Track your sustainable habits</p>
        </div>
      </footer>
    </div>
  );
}