import React from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import '../css/UserProfile.css'
import { IoArrowBackOutline } from 'react-icons/io5'
import { FaCheckCircle } from 'react-icons/fa'
import { MdOutlineErrorOutline } from 'react-icons/md'
import { FaFemale, FaMale, FaUser } from 'react-icons/fa'

import banner from '../assets/banner.png'

const genderLabel = (g) => (g === 'male' ? 'Male' : g === 'female' ? 'Female' : 'Not Set')

const AVATAR_CONFIG = {
  male: { Icon: FaMale, bg: '#dbeafe', color: '#3b82f6' },
  female: { Icon: FaFemale, bg: '#fce7f3', color: '#ec4899' },
  'not-set': { Icon: FaUser, bg: '#f1f5f9', color: '#94a3b8' },
}

function ProfileAvatar({ gender }) {
  const { Icon, bg, color } = AVATAR_CONFIG[gender] || AVATAR_CONFIG['not-set']
  return (
    <div
      aria-label='User avatar'
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        border: '4px solid #fff',
        boxShadow: '0 4px 14px rgba(18, 27, 45, 0.12)',
      }}
    >
      <Icon size={58} color={color} />
    </div>
  )
}

const UserDetails = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const user = state?.user
  const returnTo = state?.from || '/users'
  const [firstName = 'Unknown', lastName = 'User'] = (user?.name || '').split(' ')

  const profile = {
    firstName,
    lastName,
    position: user?.position || 'User',
    adminId: user?.adminId || 'N/A',
    email: user?.email || 'Not available',
    gender: user?.gender || 'not-set',
    address: user?.address || 'N/A',
    phoneNumber: user?.phoneNumber || 'Not available',
    unit: user?.unit || 'N/A',
    dateJoined: user?.dateRegistered || 'Not available',
    noOfOngoingCases: user?.ongoingCases ?? 0,
    noOfResolvedCases: user?.resolvedCases ?? 0,
    isAccountVerified: Boolean(user?.isAccountVerified),
  }

  if (!user) {
    return <Navigate to="/users" replace />
  }

  return (
    <div className='profile-container'>
      <Searchbar />
      <Sidebar />
      <div className='profile'>
        <div className='profile-header'>
          <button className='profile-back' onClick={() => navigate(returnTo)}>
            <IoArrowBackOutline size={20} />
          </button>
          <p>User Profile</p>
        </div>

        <div className='pro-file'>
          <div className='banner'>
            <img src={banner} alt='banner' />
          </div>

          <div className='profile-pic'>
            <ProfileAvatar gender={profile.gender} />
          </div>

          <div className='user-info'>
            <div className='user-info-head'>
              <div className='user-info-name'>
                <p>{profile.firstName} {profile.lastName}</p>
                {profile.isAccountVerified ? (
                  <span className='verified-badge verified' title='Account verified'>
                    <FaCheckCircle size={14} /> Verified
                  </span>
                ) : (
                  <span className='verified-badge unverified' title='Account not verified'>
                    <MdOutlineErrorOutline size={15} /> Unverified
                  </span>
                )}
              </div>
            </div>
            <p className='position'>{profile.position}</p>
            <p>Admin ID: <span>{profile.adminId}</span></p>
          </div>

          <div className='contact-info'>
            <p>Contact Information</p>
            <p><span>Email</span><span>{profile.email}</span></p>
            <p><span>Gender</span><span>{genderLabel(profile.gender)}</span></p>
            <p><span>Address</span><span>{profile.address}</span></p>
            <p><span>Phone Number</span><span>{profile.phoneNumber}</span></p>
            <p><span>Unit</span><span>{profile.unit}</span></p>
          </div>

          <div className='account-info'>
            <p>Account Information</p>
            <p><span>Date Joined</span><span>{profile.dateJoined}</span></p>
            <p><span>No of Ongoing Cases</span><span>{profile.noOfOngoingCases}</span></p>
            <p><span>No of Resolved Cases</span><span>{profile.noOfResolvedCases}</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetails
