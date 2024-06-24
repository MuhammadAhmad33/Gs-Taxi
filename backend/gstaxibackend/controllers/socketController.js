const User = require('../models/signup');
const { initializeWebSocket } = require('../socket/socket');

// Function to handle WebSocket authentication
async function authenticateWebSocket(req, res) {
    try {
        const userId = req.user;
        console.log('Authenticating WebSocket for user:', userId);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Initialize WebSocket connections
        const io = initializeWebSocket(req.server);

        // Emit an authentication event to the WebSocket server
        io.emit('authenticate', userId);

        res.status(200).json({ message: 'WebSocket authentication initiated' });
    } catch (error) {
        console.error('Error authenticating WebSocket:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { authenticateWebSocket };
