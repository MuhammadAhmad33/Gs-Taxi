const smsService = require('../services/smsService');
const loginSchema = require('../models/login');
const UserSignup = require('../models/signup');
const { generateToken } = require('../utils/jwt');
const signup = require('../models/signup');



async function loginUser(req, res) {
    const { phoneNumber } = req.body;
    console.log(phoneNumber);
    try {
        // Send verification code via SMS
        const verificationCodeInfo = await smsService.sendVerificationCode(phoneNumber);

        // Save phone number, verification code, and expiration time in the database
        const login = new loginSchema({
            phoneNumber: phoneNumber,
            verificationCode: verificationCodeInfo.code,
            expiresAt: verificationCodeInfo.expiresAt
        });
        console.log(login)
        await login.save();

        // Generate JWT token
        const token = generateToken(login._id);

        // Respond to the client with the token
        res.status(200).json({ login, token, message: 'Verification code sent successfully' });
    } catch (error) {
        console.error('Failed to send verification code:', error);
        res.status(500).json({ error: 'Failed to send verification code' });
    }
}

async function verifyCode(req, res) {
    const { code, id } = req.body;
    console.log(req.body);

    try {
        // Find the user with the provided user ID
        const user = await UserSignup.findById(id);
        console.log(user);

        // If no user found, return error
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Check if the verification code matches and is not expired
        if (user.verificationCode !== code) {
            return res.status(400).json({ error: 'Invalid code' });
        }

        // Update user verification status to true
        user.isVerified = true;
        await user.save();
        console.log(user);

        // Respond to the client
        res.status(200).json({ user, message: 'Verification code verified successfully' });
    } catch (error) {
        console.error('Failed to verify verification code:', error);
        res.status(500).json({ error: 'Failed to verify verification code' });
    }
}



async function signupUser(req, res) {
    const { name, email, phoneNumber } = req.body;
    console.log(req.body)

    try {
        // Send verification code via SMS
        const verificationCodeInfo = await smsService.sendVerificationCode(phoneNumber);

        const user = new UserSignup({
            name,
            email,
            phoneNumber,
            verificationCode: verificationCodeInfo.code,
            expiresAt: verificationCodeInfo.expiresAt
        });

        await user.save();
        const token = generateToken(signup._id);

        res.status(200).json({ user, token, message: 'User signed up successfully' });
    } catch (error) {
        console.error('Failed to sign up user:', error);
        res.status(500).json({ error: 'Failed to sign up user' });
    }
}


module.exports = {
    loginUser,
    verifyCode,
    signupUser
};
