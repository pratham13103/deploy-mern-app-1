import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import styles from "../styles/index.module.css";

function Login({ setIsAuthenticated }) {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        phoneNumber: '',
        password: '',
    });
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const sendOTP = async (email, phoneNumber) => {
        try {
            const otpResponse = await fetch('http://localhost:8080/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, phoneNumber }),
            });

            if (otpResponse.status === 200) {
                return true;
            } else {
                const otpData = await otpResponse.json();
                throw new Error(otpData.message || 'Failed to send OTP');
            }
        } catch (err) {
            throw new Error(err.message || 'An error occurred while sending OTP');
        }
    };

    const verifyOTP = async () => {
        try {
            const response = await fetch('http://localhost:8080/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp, email: loginInfo.email, phoneNumber: loginInfo.phoneNumber }),
            });
            const result = await response.json();

            if (result.success) {
                setOtpVerified(true);
                handleSuccess('OTP Verified Successfully!');
                setIsAuthenticated(true);
                navigate('/home');
            } else {
                handleError(result.message || 'Invalid OTP');
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, phoneNumber, password } = loginInfo;
        if (!email || !phoneNumber || !password) {
            return handleError('Email, phone number, and password are required.');
        }
        try {
            const url = `https://deploy-mern-app-1-ten.vercel.app/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const result = await response.json();
            const { success, message, error } = result;
    
            if (success) {
                handleSuccess(message);
                setIsAuthenticated(true); // Update authentication status
    
                // Send OTP notification
                const otpSent = await sendOTP(email, phoneNumber);
    
                if (otpSent) {
                    setOtpSent(true); // Set notification state to true
                }
            } else if (error) {
                const details = error?.details[0]?.message || 'An error occurred.';
                handleError(details);
            } else {
                handleError(message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Login</h1>
            <form onSubmit={handleLogin} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                        onChange={handleChange}
                        type="email"
                        name="email"
                        placeholder="Enter your email..."
                        value={loginInfo.email}
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="phoneNumber" className={styles.label}>Phone Number</label>
                    <input
                        onChange={handleChange}
                        type="tel"
                        name="phoneNumber"
                        placeholder="Enter your phone number..."
                        value={loginInfo.phoneNumber}
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input
                        onChange={handleChange}
                        type="password"
                        name="password"
                        placeholder="Enter your password..."
                        value={loginInfo.password}
                        className={styles.input}
                    />
                </div>
                <button type="submit" className={styles.button}>Login</button>
                <span className={styles.text}>
                    Don't have an account? <Link to="/Signup" className={styles.link}>Signup</Link>
                </span>

                {/* OTP Input Section */}
                {otpSent && !otpVerified && (
                    <div className={styles.inputGroup}>
                        <label htmlFor="otp" className={styles.label}>Enter OTP</label>
                        <input
                            type="text"
                            name="otp"
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder="Enter OTP"
                            className={styles.input}
                        />
                        <button type="button" onClick={verifyOTP} className={styles.button}>
                            Verify OTP
                        </button>
                    </div>
                )}
            </form>

            {/* Display popup after OTP is sent */}
            {otpSent && !otpVerified && (
                <div className={styles.popup}>
                    <p>OTP sent successfully to your email and phone!</p>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}

export default Login;
