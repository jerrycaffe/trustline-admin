import React, { useState } from 'react';
import text from '../assets/logotext.png';
import LoginRightSide from './LoginRightSide';
import '../css/Login.css';
import { Link } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    setEmailError('');
    setPasswordError('');

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

      console.log('Login successful:', { email, password });
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

           <Link to="/dashboard" className='link'><button type='submit'>Login</button></Link>
            <span><Link to='/forgot-password' className='link'>Forgot Password</Link></span>
            <p>
              By clicking continue, you agree to our <strong>Terms of Service</strong> and{' '}
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
