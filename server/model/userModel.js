const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  walletAddress: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  is_active: { type: Boolean, default: true },
  loginCode: String
});


const User = mongoose.model('User', UserSchema);

module.exports = User;
