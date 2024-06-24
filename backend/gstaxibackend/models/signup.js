const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: false },
    phoneNumber: { type: String, required: true },
    verificationCode: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    isVerified: { type: Boolean, required: true, default: false }

});

module.exports = mongoose.model('UserSignup', signupSchema);
