// rideRequest.model.js
const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema({
    srcLatitude: { type: Number, required: true },
    srcLongitude: { type: Number, required: true },
    destLatitude: { type: Number, required: true },
    destLongitude: { type: Number, required: true },
    radius: { type: Number, required: true },
    status: { type: String, default: 'pending' }, // 'pending', 'accepted'
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }
});

module.exports = mongoose.model('RideRequest', rideRequestSchema);
