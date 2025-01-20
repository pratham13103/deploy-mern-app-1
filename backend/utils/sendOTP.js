
const  sendSMS  = require('./sendNotification'); // Import sendSMS utility
const sendEmail = require('./sendEmail'); // Import sendEmail utility

// Function to generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

// Function to send OTP to email and phone
const sendOTP = async (email, phoneNumber) => {
    const otp = generateOTP(); // Generate OTP
    const message = `Your OTP is: ${otp}. Please use this to complete your verification.`;

    try {
        // Send OTP via SMS
        if (phoneNumber) {
            console.log(`Sending OTP via SMS to ${phoneNumber}`);
            await sendSMS(phoneNumber, message);
        }

        // Send OTP via Email
        if (email) {
            console.log(`Sending OTP via Email to ${email}`);
            await sendEmail(email, 'Your OTP Code', message);
        }

        return { success: true, otp }; // Return OTP for further validation (optional)
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error('Failed to send OTP');
    }
};

module.exports = sendOTP;
