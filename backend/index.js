const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const sendEmail = require('./utils/sendEmail'); // Import the sendEmail function
const sendOTP = require('./utils/sendOTP'); // Import sendOTP utility
const { sendSMS } = require('./utils/sendNotification'); // Import the sendSMS function

require('dotenv').config();
require('./Models/db');

const app = express();
const PORT = process.env.PORT || 8080;

// Test route
app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true, // Allow cookies and authentication headers
}));
app.post('/send-email', async (req, res) => {
    try {
        const { to, subject, text } = req.body;

        if (!to || !subject || !text) {
            return res.status(400).json({ message: 'Missing required fields: to, subject, or text.' });
        }
        
        console.log(`Sending email to: ${to}, subject: ${subject}, text: ${text}`); // Debug log

        await sendEmail(to, subject, text); // Ensure sendEmail returns a Promise
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
});

app.post('/send-sms', async (req, res) => {
    try {
        const { phoneNumber, message } = req.body;

        if (!phoneNumber || !message) {
            return res.status(400).json({ message: 'Missing required fields: phoneNumber or message.' });
        }
        
        console.log(`Sending SMS to: ${phoneNumber}, message: ${message}`); // Debug log

        await sendSMS(phoneNumber, message); // Ensure sendSMS returns a Promise
        res.status(200).json({ message: 'SMS sent successfully' });
    } catch (error) {
        console.error('Error sending SMS:', error.message);
        res.status(500).json({ message: 'Failed to send SMS', error: error.message });
    }
});

app.post('/send-otp', async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;

        if (!email && !phoneNumber) {
            return res.status(400).json({ message: 'Please provide an email or phone number.' });
        }

        const { otp } = await sendOTP(email, phoneNumber); // Generate and send OTP
        res.status(200).json({ message: 'OTP sent successfully', otp }); // Include OTP in response for testing (remove in production)
    } catch (error) {
        console.error('Error sending OTP:', error.message);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
});

app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
