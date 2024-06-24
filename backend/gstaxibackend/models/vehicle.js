const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    color: { type: String, required: true },
    modelYear: { type: Number, required: true },
    licensePlateNumber: { type: String, required: true },
    vehicleDocImages: {
        front: { type: String, required: true },
        back: { type: String, required: true }
    },
    vehicleImages: {
        front: { type: String, required: true },
        back: { type: String, required: true },
        right: { type: String, required: true },
        left: { type: String, required: true },
        frontSeats: { type: String, required: true },
        backSeats: { type: String, required: true }
    }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
