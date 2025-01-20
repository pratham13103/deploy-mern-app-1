const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

// Configure AWS SDK v3 with hardcoded credentials
const snsClient = new SNSClient({
    region: 'eu-north-1',  // AWS region
    credentials: {
        accessKeyId: 'AKIAZQ3DTEXNDWTPIBWA',
        secretAccessKey: '7ojfleSJWrPmd5lW0Oll+ZPgeYrCXe64L+8Am/Ll',
    }
});

// Function to send SMS
const sendSMS = async (message) => {
    const phoneNumber = '+919356567724';  // Your phone number in E.164 format

    const params = {
        Message: message,
        PhoneNumber: phoneNumber,  // E.164 format: +919356567724
    };

    try {
        console.log("Sending SMS...");
        const data = await snsClient.send(new PublishCommand(params));
        console.log('SMS sent:', data);
    } catch (err) {
        console.error('Error sending SMS:', err);
    }
};

// Sending SMS to the specified phone number
sendSMS('Hi from Pratham')
    .then(() => console.log('SMS process complete'))
    .catch((err) => console.error('Error in sending SMS:', err));
