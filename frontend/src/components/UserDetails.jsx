import React from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import '../css/UserDetails.css'
import { IoArrowBackOutline } from 'react-icons/io5'

const UserDetails = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const user = state?.user

  if (!user) {
    return <Navigate to="/users" replace />
  }

  return (
    <div className='user-details-container'>
      <Searchbar />
      <Sidebar />
      <div className='user-details'>
        <div className='user-details-header'>
          <button className='user-details-back' onClick={() => navigate('/users')}>
            <IoArrowBackOutline size={20} />
          </button>
          <p>User details</p>
        </div>

        <div className='user-details-card'>
          <div className='user-profile-summary'>
            <img src={user.image} alt={user.name} />
            <p>{user.name}</p>
            <span>{user.type}</span>
          </div>

          <div className='details-section'>
            <h3>Contact Information</h3>
            <div className='details-row'>
              <span>Email</span>
              <span>{user.email}</span>
            </div>
            <div className='details-row'>
              <span>Phone Number</span>
              <span>{user.phoneNumber}</span>
            </div>
          </div>

          <div className='details-section'>
            <h3>Account Information</h3>
            <div className='details-row'>
              <span>Last Login</span>
              <span>{user.lastLogin}</span>
            </div>
            <div className='details-row'>
              <span>Date Registered</span>
              <span>{user.dateRegistered}</span>
            </div>
            <div className='details-row'>
              <span>No. of Ongoing Cases</span>
              <span>{user.ongoingCases}</span>
            </div>
            <div className='details-row'>
              <span>No. of Closed Cases</span>
              <span>{user.closedCases}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetails
