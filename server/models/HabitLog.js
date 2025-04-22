const mongoose = require('mongoose');
const habitLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: String }, // 'YYYY-MM-DD'
  actions: [{
    habit: String,
    note: String,
    points: Number,
  }],
});
module.exports = mongoose.model('HabitLog', habitLogSchema);