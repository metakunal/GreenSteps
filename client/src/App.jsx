import React, { useState } from 'react';
import HabitLogger from './components/HabitLogger';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  if (!token) {
    return (
      <main className="p-4">
        <h1 className="text-3xl font-bold">GreenSteps 🌱</h1>
        <Signup setToken={setToken} />
        <Login setToken={setToken} />
      </main>
    );
  }

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold">GreenSteps 🌱</h1>
      <HabitLogger />
      <Dashboard />
    </main>
  );
}