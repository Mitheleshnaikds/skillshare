const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  skillsOffered: { type: [String], default: [] },
  skillsWanted: { type: [String], default: [] },
  credits: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', UserSchema);
