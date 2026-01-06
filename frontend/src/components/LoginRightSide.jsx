import React from 'react'
import violence from '../assets/violence.png'
import '../css/LoginRightSide.css'

const LoginRightSide = () => {
  return (
    <div className='login-rightside'>
        <div className='container'>
        <img src={violence} alt="image" />
        <h2>Report a Case</h2>
        <p>To report a case, you’d need to provide vital and legitimate information. You are also able to upload any media as evidence to support your report. After the report has been received, you would be contacted to proceed with the next steps.</p>
        </div>
    </div>
  )
}

export default LoginRightSide