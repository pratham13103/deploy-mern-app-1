import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import styles from "../styles/index.module.css";

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        phone: '' // Added phone field
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password, phone } = signupInfo;
        if (!name || !email || !password || !phone) {
            return handleError('Name, email, password, and phone number are required.');
        }
        try {
            const url = `https://deploy-mern-app-1-ten.vercel.app/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
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
            <h1 className={styles.title}>Signup</h1>
            <form onSubmit={handleSignup} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor='name' className={styles.label}>Name</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='name'
                        autoFocus
                        placeholder='Enter your name...'
                        value={signupInfo.name}
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor='email' className={styles.label}>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={signupInfo.email}
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor='password' className={styles.label}>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={signupInfo.password}
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor='phone' className={styles.label}>Phone</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='phone'
                        placeholder='Enter your phone number...'
                        value={signupInfo.phone}
                        className={styles.input}
                    />
                </div>
                <button type='submit' className={styles.button}>Signup</button>
                <span className={styles.text}>
                    Already have an account? <Link to="/Login" className={styles.link}>Login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Signup;
