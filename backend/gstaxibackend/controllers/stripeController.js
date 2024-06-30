// src/controllers/stripeController.js
const Stripe = require('stripe');
const Config = require('../config/config');
require('dotenv').config();

const stripe = Stripe(Config.stripeKey);
const charge = async (req, res) => {
    try {
        const { amount, currency, paymentMethodId, callbackUrl } = req.body;

        if (!amount || !currency || !paymentMethodId || !callbackUrl) {
            return res.status(400).send({ error: 'Missing required fields' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId,
            confirm: true,
            metadata: { integration_check: 'accept_a_payment' },
            return_url: callbackUrl,
            // Omitting receipt_email and statement_descriptor
        });

        console.log('Generated client secret:', paymentIntent.client_secret);

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
            // You can include any additional information you need to pass back to your frontend
            // or store for reference.
        });

    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).send({ error: error.message });
    }
};


module.exports = {
    charge,
};
