const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoute = require('./routes/authRoute');
const driverRoute = require('./routes/driverRoute');
const socketRoute = require('./routes/socketRoute');
const callRoute = require('./routes/callRoute');
const stripeRoute = require('./routes/stripeRoute')
const PaymentRoute = require('./routes/paymentRoute')
const config = require('./config/config');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoute);
app.use('/driver', driverRoute);
app.use('/socket', socketRoute);
app.use('/', callRoute)
app.use('/stripe', stripeRoute);
app.use('/payments', PaymentRoute)


// Connect to MongoDB
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Start the server
const port = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
