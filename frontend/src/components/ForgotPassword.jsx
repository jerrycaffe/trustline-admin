import React, { useState, useEffect } from 'react';
import success from '../assets/success.png'
import text from '../assets/logotext.png';

import '../css/ForgotPassword.css';
import ForgotPasswordSide from './ForgotPasswordSide';

import { IoMdClose } from "react-icons/io";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [timer, setTimer] = useState(300);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  // Timer countdown effect
  useEffect(() => {
    let countdown;
    if (showModal && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      window.location.reload(); // Refresh the page when timer hits 0
    }

    return () => clearInterval(countdown);
  }, [showModal, timer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError('');

    if (!email || !emailPattern.test(email)) {
      setEmailError('Provide a valid email address');
      return;
    }

    setShowModal(true); 
    setTimer(300); // Reset timer when modal opens
  };

  const handleResend = () => {
    if (!email || !emailPattern.test(email)) return;
    setTimer(300); // Reset timer again
  };

  // Format timer (mm:ss)
  const formatTime = () => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
    const seconds = String(timer % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

const handleVerify = () => {
  const enteredOtp = otp.join('');
  
  // Simulate checking OTP (e.g., '123456')
  if (enteredOtp === '123456') {
    setIsVerified(true);

    // Redirect after 2.5 seconds
    setTimeout(() => {
      window.location.href = '/reset-password'; // Replace with your actual route
    }, 1500);
  } else {
    alert('Incorrect OTP');
  }

  setShowModal(false); 
};


  return (
    <>
      <div className='forgot-container'>
        <div className='forgot-password'>
          <div className='password-form'>
            <img src={text} alt='logotext' />
            <form onSubmit={handleSubmit}>
              <h1>Forgot Password?</h1>
              <p>Input your registered email so we can help you retrieve it</p>

              <input
                type='text'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={emailError ? 'input error-border' : 'input'}
              />
              {emailError && <p className='error'>{emailError}</p>}

              <button type='submit'>Submit</button>
            </form>
          </div>
        </div>

        <ForgotPasswordSide />
      </div>

      {/*  OTP Modal */}
      {showModal && (
        <div className='modal'>
            <div className='close-icon'><IoMdClose size={30} onClick={() => setShowModal(false)}/></div>
          <h1>OTP Verification</h1>
          <p className='message'>Enter the 6-digit OTP sent to <strong>{email}</strong> to reset your password</p>
        <div className='inputs'>
        {otp.map((digit, index) => (
        <input
        key={index}
        maxLength={1}
        value={digit}
        onChange={(e) => {
        const newOtp = [...otp];
        newOtp[index] = e.target.value;
        setOtp(newOtp);
        }}
        />
        ))}
        </div>

          <span>{formatTime()} sec</span>
          <p>
            Didn't receive code? <span className='resend' onClick={handleResend}>Resend</span>
          </p>
          <button type='submit' onClick={handleVerify}>Verify</button>
        </div>
      )}

{isVerified && (
    <div className='success-popup'>
    <img src={success} alt='image'/>
    <h1>Congratulations!</h1>
    <p>Your account has been verified successfully</p>
  </div>
)}
    </>
  );
};

export default ForgotPassword;
