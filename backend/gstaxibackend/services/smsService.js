const AfricasTalking = require('africastalking');
const { generateVerificationCode } = require('../utils/codeGenerator');
const { AfricasTalkingUsername, AfricasTalkingApiKey } = require('../config/config');

const username = AfricasTalkingUsername;
const apiKey = AfricasTalkingApiKey;

const africasTalking = new AfricasTalking({ username, apiKey });
const sms = africasTalking.SMS;

const VERIFICATION_CODE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

async function sendVerificationCode(phoneNumber) {
    console.log('inside');
    const verificationCode = generateVerificationCode();
    const expirationTime = Date.now() + VERIFICATION_CODE_EXPIRATION_TIME;

    try {
        // console.log('code');
        await sms.send({
            to: phoneNumber,
            message: `Your verification code for GSTaxiApp is: ${verificationCode}`
        });
        console.log('Verification code sent successfully:', verificationCode);

        return { code: verificationCode, expiresAt: new Date(expirationTime) };
    } catch (error) {
        console.error('Failed to send verification code:', error);
        throw error;
    }
}

module.exports = {
    sendVerificationCode
};
