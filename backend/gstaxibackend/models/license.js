const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
    issuingCountry: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    issueDate: { type: Date, required: true },
    images: {
        front: { type: String, required: true }, // URL of the image of the front side of the license
        back: { type: String, required: true },  // URL of the image of the back side of the license
        selfie: { type: String, required: true } // URL of the selfie with the license
    }
});

module.exports = mongoose.model('DriverLicense', licenseSchema);