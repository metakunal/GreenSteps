import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer
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
    <div className="dashboard-container max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Your Sustainability Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card bg-white p-4 rounded-lg shadow-sm border border-green-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Eco-Points</h3>
          <p className="text-3xl font-bold text-green-700">{total}</p>
        </div>
        <div className="stat-card bg-white p-4 rounded-lg shadow-sm border border-green-100">
          <h3 className="text-gray-500 text-sm font-medium">This Week</h3>
          <p className="text-3xl font-bold text-green-700">{weekSummary}</p>
        </div>
        <div className="stat-card bg-white p-4 rounded-lg shadow-sm border border-green-100">
          <h3 className="text-gray-500 text-sm font-medium">This Month</h3>
          <p className="text-3xl font-bold text-green-700">{monthSummary}</p>
        </div>
        <div className="stat-card bg-white p-4 rounded-lg shadow-sm border border-green-100">
          <h3 className="text-gray-500 text-sm font-medium">Current Streak</h3>
          <p className="text-3xl font-bold text-green-700">
            {streak} <span className="text-lg">{streak === 1 ? 'day' : 'days'}</span>
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="chart-container bg-white p-4 rounded-lg shadow-sm border border-green-100">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Weekly Points Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderColor: '#d1fae5',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="points" 
                  stroke="#16a34a" 
                  strokeWidth={2}
                  dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                  activeDot={{ fill: '#065f46', strokeWidth: 0, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container bg-white p-4 rounded-lg shadow-sm border border-green-100">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Habit Frequency</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="habit" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderColor: '#d1fae5',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 mb-8">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Your Eco-Badges</h2>
        <div className="flex flex-wrap gap-3">
          {badges.length > 0 ? (
            badges.map(b => (
              <span 
                key={b} 
                className="badge bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium flex items-center"
              >
                <span className="mr-2">🏆</span>
                {b}
              </span>
            ))
          ) : (
            <p className="text-gray-500">Keep logging habits to earn badges!</p>
          )}
        </div>
      </div>

      {/* Global Stats and Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Global Impact</h2>
          <div className="global-stat bg-green-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-1">Total Community Eco-Points</p>
            <p className="text-3xl font-bold text-green-700">
              {global?.totalPoints?.toLocaleString() || 'Loading...'}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Top Eco-Champions</h2>
          <div className="space-y-3">
            {leaderboard.map((entry, idx) => (
              <div 
                key={idx} 
                className={`leaderboard-entry flex justify-between items-center p-3 rounded-lg ${
                  idx < 3 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <span className={`font-medium mr-3 ${
                    idx === 0 ? 'text-yellow-500 text-xl' : 
                    idx === 1 ? 'text-gray-400 text-lg' : 
                    idx === 2 ? 'text-amber-700' : 'text-gray-500'
                  }`}>
                    {idx + 1}.
                  </span>
                  <span className="font-medium text-gray-700">User {entry.user}</span>
                </div>
                <span className="font-bold text-green-700">{entry.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}