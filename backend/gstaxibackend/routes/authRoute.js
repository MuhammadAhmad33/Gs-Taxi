// routes/verificationRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');

router.post('/send-code', authController.loginUser);
router.post('/verify-code-signup', authController.verifyCode);
router.post('/verify-code-login', authController.verifyCodeLogin);

router.post('/signup', authController.signupUser);

module.exports = router;
