import React from 'react'
import '../css/UserProfile.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'

import profilePic from '../assets/profilepic.png'
import banner from '../assets/banner.png'


const UserProfile = () => {
  return (
    <div className='profile-container'>
      <Searchbar />
      <Sidebar />
      <div className='profile'>
      <div className='pro-file'>
        <div className='banner'>
            <img src={banner} alt='image'/>
        </div>
        <div className='profile-pic'>
            <img src={profilePic} alt='image'/>
        </div>
        <div className='user-info'>
        <p>Jessica Wang</p>
        <p className='position'>Support Staff</p>
        <p>Admin ID: <span>203</span></p>
        </div>
        <div className='contact-info'>
        <p>Contact Information</p>
        <p><span>Email</span><span>jessicawang96@yahoo.com</span></p>
        <p><span>Address</span><span>N/A</span></p>
        <p><span>Phone Number</span><span>+234 801 886 7528</span></p>
        <p><span>Unit</span><span>Gender-based Violence Unit</span></p>
        </div>
        <div className='account-info'>
        <p>Account Information</p>
        <p><span>Last Login</span><span>12th August, 2024</span></p>
        <p><span>Date Joined</span><span>12th August, 2024</span></p>
        <p><span>No. of Ongoing Cases</span><span>3</span></p>
        <p><span>No. of Resolved Cases</span><span>8</span></p> 
        </div>
      </div>
    </div>
    </div>
  )
}

export default UserProfile