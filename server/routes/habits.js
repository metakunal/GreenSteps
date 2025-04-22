const express = require('express');
const jwt = require('jsonwebtoken');
const HabitLog = require('../models/HabitLog');
const User = require('../models/User');
const router = express.Router();

const habits = {
  'Carpooling': 2,
  'Reused Container': 1.5,
  'Skipped Meat': 2,
  'Used Public Transport': 1.5,
  'No-Plastic Day': 2,
  'Others': 1,
};

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    res.sendStatus(401);
  }
}

router.post('/log', auth, async (req, res) => {
  const { date, actions } = req.body;
  // const existing = await HabitLog.findOne({ userId: req.user.id, date });
  // if (existing) return res.status(400).json({ error: 'Already submitted for today' });

  const actionLogs = actions.map(a => ({
    habit: a.habit,
    note: a.note || '',
    points: habits[a.habit] || 1,
  }));

  const log = await HabitLog.create({ userId: req.user.id, date, actions: actionLogs });
  await User.findByIdAndUpdate(req.user.id, { $push: { habitLogs: log._id } });
  res.json(log);
});

router.get('/me', auth, async (req, res) => {
  const logs = await HabitLog.find({ userId: req.user.id });
  res.json(logs);
});

router.get('/global', async (req, res) => {
  const allLogs = await HabitLog.find();
  const totalPoints = allLogs.reduce((sum, log) => sum + log.actions.reduce((s, a) => s + a.points, 0), 0);
  res.json({ totalPoints });
});

function getWeekRange() {
  const today = new Date();
  const start = new Date(today.setDate(today.getDate() - 6)).toISOString().split('T')[0];
  return { start };
}

function getMonthRange() {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  return { start };
}

router.get('/summary/week', auth, async (req, res) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const logs = await HabitLog.find({ userId: req.user.id });
  const filtered = logs.filter(l => new Date(l.date) >= oneWeekAgo);
  const total = filtered.reduce((sum, log) => sum + log.actions.reduce((s, a) => s + a.points, 0), 0);
  res.json({ points: total });
});

router.get('/summary/month', auth, async (req, res) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const logs = await HabitLog.find({ userId: req.user.id });
  const filtered = logs.filter(l => new Date(l.date) >= oneMonthAgo);
  const total = filtered.reduce((sum, log) => sum + log.actions.reduce((s, a) => s + a.points, 0), 0);
  res.json({ points: total });
});

router.get('/badges', auth, async (req, res) => {
  const logs = await HabitLog.find({ userId: req.user.id });
  const totalPoints = logs.reduce((sum, log) => sum + log.actions.reduce((s, a) => s + a.points, 0), 0);
  const daysLogged = logs.length;
  let badges = [];
  if (totalPoints >= 50) badges.push('Eco Hero');
  if (daysLogged >= 7) badges.push('1 Week Streak');
  if (totalPoints >= 100) badges.push('Green Legend');
  res.json({ badges });
});

const crypto = require('crypto');
router.get('/leaderboard', async (req, res) => {
  const users = await User.find().populate('habitLogs');
  const leaderboard = users.map(u => {
    const points = u.habitLogs.reduce((sum, l) => sum + l.actions.reduce((s, a) => s + a.points, 0), 0);
    return {
      user: crypto.createHash('sha256').update(u.email).digest('hex').slice(0, 6), // anonymized
      points
    };
  }).sort((a, b) => b.points - a.points);
  res.json(leaderboard);
});

module.exports = router;
