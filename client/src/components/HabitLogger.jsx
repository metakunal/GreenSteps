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
      await axios.post('http://localhost:5000/api/habits/log', { date: today, actions }, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      toast.success(quotes[Math.floor(Math.random() * quotes.length)]);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error logging habits');
    }
  };

  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold">Log Today's Habits</h2>
      <div className="grid grid-cols-2 gap-2">
        {habits.map(habit => (
          <label key={habit} className="flex items-center space-x-2">
            <input type="checkbox" onChange={() => setChecked({ ...checked, [habit]: !checked[habit] })} />
            <span>{habit}</span>
          </label>
        ))}
      </div>
      <textarea className="border mt-2 w-full" placeholder="Optional notes" value={note} onChange={e => setNote(e.target.value)} />
      <button className="bg-green-600 text-white px-4 py-2 mt-2 rounded" onClick={handleSubmit}>Submit</button>
    </div>
  );
}
