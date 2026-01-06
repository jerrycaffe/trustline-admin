import React, { useState } from 'react';
import ForgotPasswordSide from './ForgotPasswordSide';
import text from '../assets/logotext.png';
import success from '../assets/success.png';
import '../css/ResetPassword.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Show success popup
    setShowSuccess(true);

    // Redirect to login after 5 seconds
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  };

  return (
    <>
      <div className='resetpassword-container'>
        <div className='resetpassword'>
          <div className='resetpassword-form'>
            <img src={text} alt='image' />
            <form className='form' onSubmit={handleSubmit}>
              <h1>Reset Password</h1>
              <p>Enter your new password and confirm</p>

              <input
                type='password'
                placeholder='New Password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={
                  error && newPassword !== confirmPassword
                    ? 'input error-border'
                    : 'input'
                }
              />

              <input
                type='password'
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={
                  error && newPassword !== confirmPassword
                    ? 'input error-border'
                    : 'input'
                }
              />

              {error && <p className='error'>{error}</p>}

              <button type='submit'>Reset Password</button>
            </form>
          </div>
        </div>

        <ForgotPasswordSide />
      </div>

      {showSuccess && (
        <div className='success-popup'>
          <img src={success} alt='Success Icon' />
          <h1>Successful!</h1>
          <p>Your password has been reset successfully</p>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
