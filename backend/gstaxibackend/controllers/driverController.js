const Driver = require('../models/driver');
const DriverLicense = require('../models/license');
const Vehicle = require('../models/vehicle');
const RideRequest = require('../models/rideRequest');
const { generateToken } = require('../utils/jwt');

async function createDriver(req, res) {
    const { name, email, city, image } = req.body;

    try {
        // Create a new driver instance with initial location data
        const driver = new Driver({
            name,
            email,
            city,
            image,
            location: { type: 'Point', coordinates: [0, 0] } // Default to (0, 0) coordinates
        });

        // Save the driver to the database
        await driver.save();
        const token = generateToken(driver._id);

        // Respond to the client
        res.status(200).json({ driver, token, message: 'Driver created successfully' });
    } catch (error) {
        console.error('Failed to create driver:', error);
        res.status(500).json({ error: 'Failed to create driver' });
    }
}

async function getDriverById(req, res) {
    const { driverId } = req.params;

    try {
        const driver = await Driver.findById(driverId);

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.status(200).json({ driver });
    } catch (error) {
        console.error('Failed to fetch driver:', error);
        res.status(500).json({ error: 'Failed to fetch driver' });
    }
}


async function saveDriverLicense(req, res) {
    const { issuingCountry, firstName, lastName, licenseNumber, issueDate, images } = req.body;

    try {
        // Create a new instance of DriverLicense with the provided data
        const license = new DriverLicense({
            issuingCountry,
            firstName,
            lastName,
            licenseNumber,
            issueDate,
            images
        });

        // Save the license details in the database
        await license.save();

        // Respond to the client
        res.status(200).json({ license, message: 'Driver license details saved successfully' });
    } catch (error) {
        console.error('Failed to save driver license details:', error);
        res.status(500).json({ error: 'Failed to save driver license details' });
    }
}


async function saveVehicleData(req, res) {
    const { make, model, color, modelYear, licensePlateNumber, vehicleDocImages, vehicleImages } = req.body;

    try {
        // Create a new vehicle instance
        const vehicle = new Vehicle({
            make,
            model,
            color,
            modelYear,
            licensePlateNumber,
            vehicleDocImages,
            vehicleImages
        });

        // Save the vehicle data to the database
        await vehicle.save();

        // Respond to the client
        res.status(200).json({ vehicle, message: 'Vehicle data saved successfully' });
    } catch (error) {
        console.error('Failed to save vehicle data:', error);
        res.status(500).json({ error: 'Failed to save vehicle data' });
    }
}

async function updateLocation(req, res) {
    const { driverId, latitude, longitude } = req.body;

    try {
        const driver = await Driver.findByIdAndUpdate(driverId, {
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        }, { new: true });

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.json(driver);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update location' });
    }
};

async function findDrivers(req, res) {
    const { srcLatitude, srcLongitude, radius } = req.body;

    try {
        const drivers = await Driver.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[srcLongitude, srcLatitude], radius / 6378.1] // radius in kilometers
                }
            }
        });
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to find drivers' });
    }
};


async function createRideRequest(req, res) {
    const { srcLatitude, srcLongitude, destLatitude, destLongitude, radius } = req.body;
    try {
        const rideRequest = new RideRequest({
            srcLatitude,
            srcLongitude,
            destLatitude,
            destLongitude,
            radius
        });
        await rideRequest.save();

        // Find available drivers within the radius
        const drivers = await Driver.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[srcLongitude, srcLatitude], radius / 6378.1]
                }
            },
            available: true
        });

        if (drivers.length > 0) {
            // Notify drivers (assuming a notifyDriver function exists)
            drivers.forEach(driver => notifyDriver(driver, rideRequest));
        }

        res.status(200).json({ message: 'Ride request created', rideRequest });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create ride request' });
    }
};

async function acceptRideRequest(req, res) {
    const { rideRequestId, driverId } = req.params;
    try {
        const rideRequest = await RideRequest.findById(rideRequestId);
        if (rideRequest.status === 'pending') {
            rideRequest.status = 'accepted';
            rideRequest.acceptedBy = driverId;
            await rideRequest.save();

            // Update driver's availability
            const driver = await Driver.findById(driverId);
            driver.available = false;
            await driver.save();

            // Notify other drivers (assuming a notifyOtherDrivers function exists)
            notifyOtherDrivers(rideRequestId);

            res.status(200).json({ message: 'Ride request accepted', rideRequest });
        } else {
            res.status(400).json({ message: 'Ride request already accepted' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to accept ride request' });
    }
};

function notifyDriver(driver, rideRequest) {
    // Function to notify a driver about the new ride request
    console.log(`Notifying driver ${driver.name} about ride request ${rideRequest._id}`);
}

function notifyOtherDrivers(rideRequestId) {
    // Function to notify other drivers that the ride request has been accepted
    console.log(`Notifying other drivers that ride request ${rideRequestId} has been accepted`);
}



module.exports = {
    createDriver,
    saveDriverLicense,
    saveVehicleData,
    updateLocation,
    findDrivers,
    createRideRequest,
    acceptRideRequest,
    getDriverById
};
