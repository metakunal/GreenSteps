import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const habits = ['Carpooling', 'Reused Container', 'Skipped Meat', 'Used Public Transport', 'No-Plastic Day', 'Others'];
const quotes = [
  "Small steps make a big difference 🌍",
  "You're helping the planet today 💚",
  "Consistency > Perfection. Keep it up!",
  "One habit at a time. One Earth to save.",
];

export default function HabitLogger() {
  const [checked, setChecked] = useState({});
  const [note, setNote] = useState('');

  const handleSubmit = async () => {
    const actions = habits.filter(h => checked[h]).map(h => ({ habit: h, note }));
    const today = new Date().toISOString().split('T')[0];
    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/habits/log`, { date: today, actions }, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      toast.success(quotes[Math.floor(Math.random() * quotes.length)]);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error logging habits');
    }
  };

  return (
    <div className="habit-logger-container max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Log Today's Eco-Friendly Habits</h2>
      <p className="text-gray-600 mb-4">Check all the sustainable habits you practiced today:</p>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {habits.map(habit => (
          <label key={habit} className={`habit-item flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all 
            ${checked[habit] ? 'bg-green-100 border border-green-300' : 'hover:bg-gray-50 border border-gray-200'}`}>
            <input 
              type="checkbox" 
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              onChange={() => setChecked({ ...checked, [habit]: !checked[habit] })} 
            />
            <span className={`font-medium ${checked[habit] ? 'text-green-800' : 'text-gray-700'}`}>{habit}</span>
          </label>
        ))}
      </div>
      
      <textarea 
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
        rows="3"
        placeholder="Optional notes (e.g., details about 'Others', challenges faced, etc.)" 
        value={note} 
        onChange={e => setNote(e.target.value)} 
      />
      
      <button 
        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        onClick={handleSubmit}
      >
        Submit Today's Habits
      </button>
    </div>
  );
}