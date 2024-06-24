// controllers/callController.js
const { makeCall } = require('../services/callService');

async function initiateCall(req, res) {
    const { callTo, callFrom } = req.body;
    console.log('Initiating call to:', callTo, 'from:', callFrom);
    if (!callTo || !callFrom) {
        return res.status(400).json({ error: 'Both callTo and callFrom are required' });
    }

    try {
        await makeCall(callTo, callFrom);
        res.status(200).json({ message: 'Call initiated successfully' });
    } catch (error) {
        console.error('Failed to initiate call:', error);
        res.status(500).json({ error: 'Failed to initiate call' });
    }
}

module.exports = {
    initiateCall
};
