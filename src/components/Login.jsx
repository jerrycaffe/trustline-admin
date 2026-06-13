import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import LoginRightSide from './LoginRightSide';
import '../css/Login.css';
import { api, AUTH_ENDPOINTS } from '../services/api';

const STORAGE_SECRET = import.meta.env.VITE_STORAGE_SECRET;

const encryptAndStore = (key, value) => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), STORAGE_SECRET).toString();
  localStorage.setItem(key, encrypted);
};


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailPattern.test(email);
  const isPasswordValid = password.length >= 8;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (emailTouched) {
      setEmailError(emailPattern.test(val) ? '' : 'Provide a valid email address');
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(isEmailValid ? '' : 'Provide a valid email address');
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (passwordTouched) {
      setPasswordError(val.length >= 8 ? '' : 'Password must be at least 8 characters');
    }
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setPasswordError(isPasswordValid ? '' : 'Password must be at least 8 characters');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setApiError('');
    setIsLoading(true);
    try {
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, {
        userName: email,
        password,
        institutionId: import.meta.env.VITE_INSTITUTION_ID,
      });

      console.log('Login response:', response);

      // Token may be at different paths depending on API shape
      const token =
        response.token ||
        response.accessToken ||
        response.data?.token ||
        response.data?.accessToken;
        console.log('Extracted token:', token);

      if (!token) {
        setApiError('Login failed. No token returned.');
        return;
      }

      // Decode JWT payload (base64url middle segment)
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(
        atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
      );

      console.log('Decoded JWT payload:', payload);

      // Encrypt and store token + all user data
      encryptAndStore('authToken', token);
      encryptAndStore('authUser', { ...payload, ...response });
      encryptAndStore('authEmail', email);

      navigate('/dashboard');
    } catch (error) {
      setApiError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='login-container'>
      <div className='login'>
        <div className='login-form'>
          <h2 className='logo-text'>TrustLine</h2>
          <form className='form' onSubmit={handleSubmit}>
            <h1>Welcome back!</h1>
            <p>Enter your details to login</p>
            <input
            type='text'
            placeholder='Email'
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            className={emailError ? 'input error-border' : 'input'}
            />
            {emailError && <p className='error'>{emailError}</p>}

            <div className='password-wrapper'>
              <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              className={passwordError ? 'input password-input error-border' : 'input password-input'}
              />
              <span
                className='password-toggle-icon'
                role='button'
                tabIndex={0}
                onClick={() => setShowPassword((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowPassword((prev) => !prev);
                  }
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </span>
            </div>
            {passwordError && <p className='error'>{passwordError}</p>}

            {apiError && <p className='error'>{apiError}</p>}
            <button type='submit' disabled={!isFormValid || isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
      <LoginRightSide />
    </div>
  );
};

export default Login;
