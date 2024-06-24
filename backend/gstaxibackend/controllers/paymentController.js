const { FedaPay, Transaction, ApiConnectionError } = require('fedapay');
const UserSignup = require('../models/signup');  // Adjust the path as necessary
const config = require('../config/config');

FedaPay.setApiKey(config.fedaPaymentKey); // Ensure your API key is correct
FedaPay.setEnvironment('live'); // or 'live' for production

const handlePaymentProcess = async (req, res) => {
    try {
        const { description, amount, callback_url, currency, customerId, paymentMethod } = req.body;

        // Fetch customer details from your database using customerId
        const user = await UserSignup.findById(customerId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        // Step 1: Create the transaction
        let transaction;
        try {
            transaction = await Transaction.create({
                description,
                amount,
                callback_url,
                currency: {
                    iso: currency
                },
                customer: {
                    firstname: user.name.split(' ')[0],
                    lastname: user.name.split(' ')[1] || '',
                    email: user.email,
                    phone_number: {
                        number: user.phoneNumber,
                        country: 'BJ'  // Adjust country code as necessary
                    }
                }
            });
            console.log('Transaction created:', transaction);

        } catch (error) {
            console.error('Error creating transaction:', error);
            let errorMessage = 'Error processing payment';
            if (error instanceof ApiConnectionError) {
                errorMessage = 'Failed to connect to FedaPay API';
            }

            return res.status(500).json({
                success: false,
                message: errorMessage,
                error: {
                    message: error.message,
                    status: error.httpStatus,
                    errorMessage: error.errorMessage
                }
            });
        }

        // Step 2: Generate the token and payment link
        let token;
        try {
            token = (await transaction.generateToken()).token;
        } catch (error) {
            console.error('Error generating token:', error);
            return res.status(500).json({
                success: false,
                message: 'Error generating payment token',
                error: {
                    message: error.message,
                    status: error.httpStatus,
                    errorMessage: error.errorMessage
                }
            });
        }

        // Step 3: Send the payment request
        try {
            if (paymentMethod === 'credit_card') {
                // For credit card payments, you might have additional fields like card details
                const creditCardPayment = await transaction.payWithCreditCard({
                    token,
                    // Add additional credit card details here if required
                });
                console.log('Credit card payment successful:', creditCardPayment);
            } else {
                // Default behavior for mobile money or other payment methods
                await transaction.sendNowWithToken(paymentMethod, token);
                console.log('Mobile money payment request sent');
            }
        } catch (error) {
            console.error('Error sending payment request:', error);
            return res.status(500).json({
                success: false,
                message: 'Error sending payment request',
                error: {
                    message: error.message,
                    status: error.httpStatus,
                    errorMessage: error.errorMessage
                }
            });
        }

        // Step 4: Retrieve the transaction details
        let retrievedTransaction;
        try {
            retrievedTransaction = await Transaction.retrieve(transaction.id);
        } catch (error) {
            console.error('Error retrieving transaction:', error);
            return res.status(500).json({
                success: false,
                message: 'Error retrieving transaction details',
                error: {
                    message: error.message,
                    status: error.httpStatus,
                    errorMessage: error.errorMessage
                }
            });
        }

        // Step 5: Return the transaction details including status
        res.status(200).json({
            success: true,
            message: 'Payment request sent successfully',
            transaction: retrievedTransaction
        });
    } catch (error) {
        console.error('General error:', error);

        res.status(500).json({
            success: false,
            message: 'General error processing payment',
            error: {
                message: error.message,
                stack: error.stack
            }
        });
    }
};

module.exports = {
    handlePaymentProcess
};
