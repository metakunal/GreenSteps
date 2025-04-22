import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HabitLogger from './components/HabitLogger';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import { Toaster } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

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
      <main className="p-4">
        <Toaster />
        <h1 className="text-3xl font-bold mb-4">GreenSteps 🌱</h1>
        <Signup setToken={setToken} />
        <Login setToken={setToken} />
      </main>
    );
  }

  return (
    <main className="p-4">
      <Toaster />
      <h1 className="text-3xl font-bold">GreenSteps 🌱</h1>
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-700">Hi, {email}</p>
        <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded">Sign Out</button>
      </div>
      <nav className="space-x-4 mb-4">
        <Link to="/log" className="text-blue-600 underline">Log Habits</Link>
        <Link to="/dashboard" className="text-blue-600 underline">Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/log" element={<HabitLogger />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<HabitLogger />} />
      </Routes>
    </main>
  );
}
