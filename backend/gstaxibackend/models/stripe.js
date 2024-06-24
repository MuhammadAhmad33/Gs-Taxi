const mongoose = require('mongoose');

const StripeChargeSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true,
    },
    stripeChargeId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('StripeCharge', StripeChargeSchema);
