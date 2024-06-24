const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: false },
    city: { type: String, required: true },
    image: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: false, default: 'Point' },
        coordinates: { type: [Number], required: false }
    },
    available: { type: Boolean, default: true }
});

driverSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Driver', driverSchema);
