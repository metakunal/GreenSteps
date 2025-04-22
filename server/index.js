const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
require('dotenv').config();

const app = express();
// Allow requests from your frontend origin
app.use(cors({
  origin: 'http://localhost:5173' // Your frontend URL
}));
app.use(express.json());

// Updated MongoDB connection using Promises
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
