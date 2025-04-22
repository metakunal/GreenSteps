import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-white px-4">
      <h1 className="text-4xl font-bold text-green-700">Welcome to GreenSteps 🌱</h1>
      <p className="mt-2 text-lg text-gray-600">Track your eco-habits. Earn rewards. Save the planet.</p>
      <div className="mt-6 space-x-4">
        <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Login</Link>
        <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign Up</Link>
      </div>
    </div>
  );
}
