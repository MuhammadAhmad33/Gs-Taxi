const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');

router.post('/charge', stripeController.charge);

module.exports = router;
