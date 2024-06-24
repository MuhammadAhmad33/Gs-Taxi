// src/controllers/stripeController.js
const Stripe = require('stripe');
const Config = require('../config/config')
const StripeCharge = require('../models/stripe');
require('dotenv').config();

const stripe = Stripe(Config.stripeKey);

const charge = async (req, res) => {
    try {
        const { amount, currency, source } = req.body;

        if (!amount || !currency || !source) {
            return res.status(400).send({ error: 'Missing required fields' });
        }

        const stripeCharge = await stripe.charges.create({
            amount,
            currency,
            source,
        });

        // Save the Stripe charge details to MongoDB
        const newCharge = new StripeCharge({
            amount: stripeCharge.amount,
            currency: stripeCharge.currency,
            source: stripeCharge.source.id,
            stripeChargeId: stripeCharge.id,
        });
        await newCharge.save();

        res.status(200).send(stripeCharge);

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    charge,
};
