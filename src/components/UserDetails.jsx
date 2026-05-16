import React, { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import '../css/UserProfile.css'
import { IoArrowBackOutline } from 'react-icons/io5'
import { FaCheckCircle } from 'react-icons/fa'
import { MdOutlineErrorOutline } from 'react-icons/md'
import { FaFemale, FaMale, FaUser } from 'react-icons/fa'
import { api } from '../services/api'

import banner from '../assets/banner.png'

const genderLabel = (g) => (g === 'male' ? 'Male' : g === 'female' ? 'Female' : 'Not Set')

const AVATAR_CONFIG = {
  male: { Icon: FaMale, bg: '#dbeafe', color: '#3b82f6' },
  female: { Icon: FaFemale, bg: '#fce7f3', color: '#ec4899' },
  'not-set': { Icon: FaUser, bg: '#f1f5f9', color: '#94a3b8' },
}

const extractUserDetails = (response) => {
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      return response.data
    }

    return response
  }

  return null
}

const formatProfileDate = (value) => {
  if (!value) {
    return 'Not available'
  }

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Not available'
  }

  return parsedDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const normalizeProfile = (user = {}) => {
  const firstName = String(user.firstName || '').trim()
  const lastName = String(user.lastName || '').trim()
  const fullName = String(user.name || '').trim()
  const fullNameParts = fullName ? fullName.split(/\s+/) : []
  const fallbackFirstName = fullNameParts[0] || 'Unknown'
  const fallbackLastName = fullNameParts.slice(1).join(' ') || 'User'
  const roles = Array.isArray(user.roles)
    ? user.roles.map((role) => String(role || '').trim()).filter(Boolean)
    : []
  const normalizedGender = String(user.gender || '').toLowerCase()
  const gender = normalizedGender === 'male' || normalizedGender === 'female' ? normalizedGender : 'not-set'
  const status = String(user.status || '').toLowerCase()
  const isAccountVerified = typeof user.isAccountVerified === 'boolean'
    ? user.isAccountVerified
    : status === 'active'

  return {
    firstName: firstName || fallbackFirstName,
    lastName: lastName || fallbackLastName,
    position: user.position || roles[0] || 'User',
    adminId: user.userId || user.id || user.adminId || 'N/A',
    email: user.email || 'Not available',
    gender,
    address: user.address || 'N/A',
    phoneNumber: user.phoneNumber || 'Not available',
    unit: user.unit || 'N/A',
    dateJoined: formatProfileDate(user.createdAt || user.dateJoined || user.dateRegistered),
    noOfOngoingCases: Number(user.ongoingCases ?? user.noOfOngoingCases ?? 0) || 0,
    noOfResolvedCases: Number(user.resolvedCases ?? user.noOfResolvedCases ?? 0) || 0,
    isAccountVerified,
  }
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
  const { userId } = useParams()
  const { state } = useLocation()
  const [userDetails, setUserDetails] = useState(state?.user || null)
  const [isLoadingUser, setIsLoadingUser] = useState(Boolean(userId))
  const returnTo = state?.from || '/users'
  const profile = useMemo(() => normalizeProfile(userDetails || state?.user || {}), [state?.user, userDetails])

  useEffect(() => {
    let isActive = true

    const loadUserDetails = async () => {
      if (!userId) {
        setIsLoadingUser(false)
        return
      }

      setIsLoadingUser(true)

      try {
        const response = await api.get(`/api/v1/admin/users/${userId}`)
        const userPayload = extractUserDetails(response)

        if (!isActive) return
        if (userPayload) {
          setUserDetails(userPayload)
        }
      } catch (error) {
        if (!isActive) return
      } finally {
        if (isActive) {
          setIsLoadingUser(false)
        }
      }
    }

    loadUserDetails()

    return () => {
      isActive = false
    }
  }, [userId])

  if (!userId && !state?.user) {
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

        {isLoadingUser ? <p style={{ margin: '8px 0 0 0' }}>Loading user details...</p> : null}

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
