const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");
const sendEmail = require("../utils/sendEmail");
const sendNotification = require("../utils/sendNotification");
const sendOTP = require("../utils/sendOTP"); // Import the sendOTP utility function
 
// Function to handle signup
const signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({
                message: 'User already exists, you can login',
                success: false
            });
        }

        // Generate and send OTP
        const { otp } = await sendOTP(email, phone);

        // Optionally, store OTP in session or cache for later verification
        req.session = { otp, email, phone, name, password }; // Requires session middleware

        return res.status(200).json({
            message: "OTP sent successfully. Please verify your OTP to complete signup.",
            success: true
        });

        // Proceed with saving the user only after OTP verification (handled in a separate API)
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Function to handle login
const login = async (req, res) => {
    try {
        const { email, password, phone } = req.body;
        const errorMsg = 'Authentication failed, email/phone or password is incorrect';

        // Find user by email or phone
        const user = await UserModel.findOne({
            $or: [{ email }, { phone }]
        });

        if (!user) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        // Generate and send OTP
        const { otp } = await sendOTP(user.email, user.phone);

        // Optionally, store OTP in session or cache for later verification
        req.session = { otp, userId: user._id };

        return res.status(200).json({
            message: "OTP sent successfully. Please verify to complete login.",
            success: true
        });

        // Complete login process only after OTP verification (handled in a separate API)
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Function to verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;

        // Verify OTP
        if (req.session.otp === otp) {
            const { email, phone, name, password, userId } = req.session;

            // If signing up, save the new user
            if (email && password && !userId) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new UserModel({ name, email, phone, password: hashedPassword });
                await newUser.save();

                // Clear session
                req.session = null;

                return res.status(201).json({
                    message: "Signup successful",
                    success: true
                });
            }

            // If logging in, generate JWT
            if (userId) {
                const jwtToken = jwt.sign(
                    { userId },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                // Clear session
                req.session = null;

                return res.status(200).json({
                    message: "Login successful",
                    success: true,
                    jwtToken
                });
            }
        }

        // If OTP does not match
        return res.status(400).json({
            message: "Invalid OTP. Please try again.",
            success: false
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = {
    signup,
    login,
    verifyOTP
};
