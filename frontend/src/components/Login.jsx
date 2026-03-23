import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import text from '../assets/logotext.png';
import LoginRightSide from './LoginRightSide';
import '../css/Login.css';
import { api, AUTH_ENDPOINTS } from '../services/api';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    setEmailError('');
    setPasswordError('');
    setApiError('');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError('Provide a valid email address');
      valid = false;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    }

    if (valid) {
      setIsLoading(true);
      try {
        const response = await api.post(AUTH_ENDPOINTS.LOGIN, { email, password })

        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        navigate('/dashboard');
      } catch (error) {
        setApiError(error.message || 'Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className='login-container'>
      <div className='login'>
        <div className='login-form'>
          <img src={text} alt='logotext' />
          <form className='form' onSubmit={handleSubmit}>
            <h1>Welcome back!</h1>
            <p>Enter your details to login</p>
            <input
            type='text'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={emailError ? 'input error-border' : 'input'}
            />
            {emailError && <p className='error'>{emailError}</p>}

            <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={passwordError ? 'input error-border' : 'input'}
            />
            {passwordError && <p className='error'>{passwordError}</p>}

            {apiError && <p className='error'>{apiError}</p>}
            <button type='submit' disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <span><Link to='/forgot-password' className='link'>Forgot Password</Link></span>
            <p>
              By clicking continue, you agree to our <strong>Terms of Service</strong> and
              <strong>Privacy Policy</strong>
            </p>
          </form>
        </div>
      </div>
      <LoginRightSide />
    </div>
  );
};

export default Login;
