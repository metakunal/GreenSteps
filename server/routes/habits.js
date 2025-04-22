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

module.exports = router;
