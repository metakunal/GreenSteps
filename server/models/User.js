const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  habitLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HabitLog' }],
});
module.exports = mongoose.model('User', userSchema);