import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar
  } from 'recharts';
  

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [global, setGlobal] = useState(null);
  const [weekSummary, setWeekSummary] = useState(0);
  const [monthSummary, setMonthSummary] = useState(0);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/habits/me`, { headers: { Authorization: token } }).then(res => {
        // Make sure logs is always an array
        setLogs(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Error fetching user data:", err);
        setLogs([]);
      });
    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/habits/global`).then(res => setGlobal(res.data));
    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/habits/summary/week`, { headers: { Authorization: token } }).then(res => setWeekSummary(res.data.points));
    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/habits/summary/month`, { headers: { Authorization: token } }).then(res => setMonthSummary(res.data.points));
    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/habits/badges`, { headers: { Authorization: token } }).then(res => setBadges(res.data.badges));
    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/habits/leaderboard`).then(res => setLeaderboard(res.data));
  }, []);

  const total = logs.reduce((sum, l) => sum + l.actions.reduce((s, a) => s + a.points, 0), 0);

  const formatDate = str => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  const last7Days = logs
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7)
    .map(log => ({
      date: formatDate(log.date),
      points: log.actions.reduce((s, a) => s + a.points, 0),
    }));

  const habitCounts = {};
  logs.forEach(log => {
    log.actions.forEach(a => {
      habitCounts[a.habit] = (habitCounts[a.habit] || 0) + 1;
    });
  });
  const habitBarData = Object.entries(habitCounts).map(([habit, count]) => ({ habit, count }));

  const today = new Date().toISOString().split('T')[0];
  const streak = (() => {
    let count = 0;
    let date = new Date();
    for (let i = 0; i < 100; i++) {
      const dateStr = date.toISOString().split('T')[0];
      if (logs.find(l => l.date === dateStr)) {
        count++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  })();

  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold">Your Stats</h2>
      <p>Total Eco-Points: {total}</p>
      <p>Points this Week: {weekSummary}</p>
      <p>Points this Month: {monthSummary}</p>
      <p>Current Streak: {streak} {streak === 1 ? 'day' : 'days'}</p>

      <h3 className="text-lg font-semibold mt-4">Weekly Points</h3>
      <LineChart width={300} height={200} data={last7Days}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="points" stroke="#16a34a" />
      </LineChart>

      <h3 className="text-lg font-semibold mt-4">Habit Usage</h3>
      <BarChart width={300} height={200} data={habitBarData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="habit" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#3b82f6" />
      </BarChart>

      <h2 className="text-xl font-semibold mt-4">Badges</h2>
      <div className="flex flex-wrap gap-2">
        {badges.map(b => (
          <span key={b} className="bg-green-200 px-3 py-1 rounded-full">{b}</span>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-4">Global Stats</h2>
      <p>Total Eco-Points (All Users): {global?.totalPoints}</p>

      <h2 className="text-xl font-semibold mt-4">Leaderboard</h2>
      <ol className="list-decimal list-inside">
        {leaderboard.map((entry, idx) => (
          <li key={idx}>
            User {entry.user}: {entry.points} points
          </li>
        ))}
      </ol>
    </div>
  );
}
