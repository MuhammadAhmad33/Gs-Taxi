const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

router.post('/create-driver', driverController.createDriver);
router.post('/driver-license', driverController.saveDriverLicense);
router.post('/vehicle', driverController.saveVehicleData);
router.post('/update-location', driverController.updateLocation);
router.post('/find-drivers', driverController.findDrivers);
router.post('/ride-requests', driverController.createRideRequest);
router.post('/ride-requests/accept/:rideRequestId/:driverId', driverController.acceptRideRequest);
router.get('/getdriver/:driverId', driverController.getDriverById)
module.exports = router;
