const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  verificationCode: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isVerified: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('UserLogin', loginSchema);