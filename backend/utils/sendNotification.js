const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

// Configure AWS SDK v3 with hardcoded credentials
const snsClient = new SNSClient({
    region: 'eu-north-1',  // AWS region
    credentials: {
        accessKeyId: 'AKIAZQ3DTEXNDWTPIBWA',
        secretAccessKey: '7ojfleSJWrPmd5lW0Oll+ZPgeYrCXe64L+8Am/Ll',
    }
});

// Function to send OTP SMS only
const sendOTP = async (phoneNumber, otp) => {
    const message = `Your OTP is: ${otp}. Please use this to complete your verification.`;

    const params = {
        Message: message,
        PhoneNumber: phoneNumber,  // E.164 format, e.g., +919356567724
    };

    try {
        console.log("Sending OTP SMS...");
        const data = await snsClient.send(new PublishCommand(params));
        console.log('OTP SMS sent:', data);
    } catch (err) {
        console.error('Error sending OTP SMS:', err);
    }
};

module.exports = sendOTP;
