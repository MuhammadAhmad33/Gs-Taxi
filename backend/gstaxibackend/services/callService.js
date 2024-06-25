// services/callService.js
const AfricasTalking = require('africastalking');
const { AfricasTalkingUsername, AfricasTalkingApiKey } = require('../config/config');

const username = AfricasTalkingUsername;
const apiKey = AfricasTalkingApiKey;

const africasTalking = new AfricasTalking({ username, apiKey });
const voice = africasTalking.VOICE;

async function makeCall(callTo, callFrom) {
    try {
        const response = await voice.call({
            to: callTo,
            from: callFrom
        });
        console.log('Call initiated successfully:', response);
        return response;
    } catch (error) {
        console.error('Failed to initiate call:', error);
        throw error;
    }
}

module.exports = {
    makeCall
};
