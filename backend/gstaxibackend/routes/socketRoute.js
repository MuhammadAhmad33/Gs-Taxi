const express = require('express');
const router = express.Router();
const socketController = require('../controllers/socketController');
const { decodeToken } = require('../utils/jwt');

// Route to authenticate WebSocket connections
router.get('/chat', decodeToken, socketController.authenticateWebSocket);

module.exports = router;
