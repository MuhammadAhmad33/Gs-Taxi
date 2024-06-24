// routes/callRoutes.js
const express = require('express');
const router = express.Router();
const callController = require('../controllers/callController');

// Route to initiate a call
router.post('/make-call', callController.initiateCall);

module.exports = router;
