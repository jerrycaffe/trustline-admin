import React from 'react'
import violence from '../assets/violence.png'
import '../css/LoginRightSide.css'

const LoginRightSide = () => {
  return (
    <div className='login-rightside'>
        <div className='container'>
        <img src={violence} alt="image" />
        <h2>Manage Reported Cases</h2>
        <p>TrustLine is a secure case management platform designed to help organizations track, investigate, and resolve reported incidents with transparency and accountability.</p>
        </div>
    </div>
  )
}

export default LoginRightSide