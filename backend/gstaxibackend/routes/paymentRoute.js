const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Payment callback route
router.post('/process-payment', paymentController.handlePaymentProcess);

module.exports = router;
