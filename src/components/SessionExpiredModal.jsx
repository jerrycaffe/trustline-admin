import React, { useEffect, useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import CryptoJS from 'crypto-js'
import { api, AUTH_ENDPOINTS, getStoredEmail } from '../services/api'
import '../css/SessionExpiredModal.css'

const STORAGE_SECRET = import.meta.env.VITE_STORAGE_SECRET

const encryptAndStore = (key, value) => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), STORAGE_SECRET).toString()
  localStorage.setItem(key, encrypted)
}

const SessionExpiredModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleSessionExpired = () => {
      const storedEmail = getStoredEmail()
      setEmail(storedEmail || '')
      setPassword('')
      setError('')
      setShowPassword(false)
      setIsOpen(true)
    }

    window.addEventListener('sessionExpired', handleSessionExpired)
    return () => window.removeEventListener('sessionExpired', handleSessionExpired)
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!password) return

    setIsLoading(true)
    setError('')

    try {
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, {
        userName: email,
        password,
        institutionId: import.meta.env.VITE_INSTITUTION_ID,
      })

      const token =
        response.token ||
        response.accessToken ||
        response.data?.token ||
        response.data?.accessToken

      if (!token) {
        setError('Login failed. No token returned.')
        return
      }

      const payloadBase64 = token.split('.')[1]
      const payload = JSON.parse(
        atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
      )

      encryptAndStore('authToken', token)
      encryptAndStore('authUser', { ...payload, ...response })
      encryptAndStore('authEmail', email)

      setIsOpen(false)
      setPassword('')
      window.dispatchEvent(new CustomEvent('sessionRestored'))
    } catch (err) {
      setError(err.message || 'Login failed. Please check your password and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='session-modal-overlay' role='dialog' aria-modal='true' aria-labelledby='session-modal-title'>
      <div className='session-modal'>
        <div className='session-modal-icon' aria-hidden='true'>🔒</div>
        <h2 id='session-modal-title' className='session-modal-title'>Session Expired</h2>
        <p className='session-modal-subtitle'>
          Your session has timed out. Please enter your password to continue.
        </p>

        <form className='session-modal-form' onSubmit={handleSubmit}>
          <div className='session-modal-field'>
            <label htmlFor='session-email'>Email</label>
            <input
              id='session-email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='email'
              required
            />
          </div>

          <div className='session-modal-field'>
            <label htmlFor='session-password'>Password</label>
            <div className='session-password-wrap'>
              <input
                id='session-password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
                autoComplete='current-password'
                autoFocus
                required
              />
              <button
                type='button'
                className='session-password-toggle'
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {error ? <p className='session-modal-error'>{error}</p> : null}

          <button
            type='submit'
            className='session-modal-submit'
            disabled={isLoading || !password}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SessionExpiredModal
