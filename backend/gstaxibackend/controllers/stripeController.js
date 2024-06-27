// src/controllers/stripeController.js
const Stripe = require('stripe');
const Config = require('../config/config');
require('dotenv').config();

const stripe = Stripe(Config.stripeKey);

const charge = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        if (!amount || !currency) {
            return res.status(400).send({ error: 'Missing required fields' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    charge,
};
