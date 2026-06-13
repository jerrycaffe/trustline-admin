import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/UserProfile.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import { IoArrowBackOutline } from 'react-icons/io5'
import { FiCamera, FiEdit2, FiLock } from 'react-icons/fi'
import { FaCheckCircle, FaUserCircle } from 'react-icons/fa'
import { MdOutlineErrorOutline } from 'react-icons/md'
import { api } from '../services/api'
import banner from '../assets/banner.png'

const initialProfile = {
  firstName: '...',
  lastName: '...',
  position: 'Support Staff',
  adminId: '...',
  email: '...',
  gender: '...',
  address: 'N/A',
  phoneNumber: 'N/A',
  unit: 'N/A',
  dateJoined: 'N/A',
  isAccountVerified: true,
}

const genderLabel = (g) => (g === 'male' ? 'Male' : g === 'female' ? 'Female' : 'Not Set')

const Spinner = () => <span className='profile-spinner' aria-hidden='true' />

const extractProfilePayload = (response) => {
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      return response.data
    }

    return response
  }

  return null
}

const normalizeGender = (gender) => {
  const value = String(gender || '').toLowerCase()
  return value === 'male' || value === 'female' ? value : 'not-set'
}

const normalizeProfile = (user = {}) => ({
  ...initialProfile,
  adminId: user.userId || initialProfile.adminId,
  position: user.role || initialProfile.position,
  email: user.email || initialProfile.email,
  phoneNumber: user.phoneNumber || "N/A",
  firstName: user.firstName || "N/A",
  lastName: user.lastName || "N/A",
  gender: normalizeGender(user.gender),
  unit: user.unit || "N/A",
  dateJoined: user.createdAt ? new Date(user.createdAt).toDateString() : "N/A",
})

const UserProfile = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [profile, setProfile] = useState(initialProfile)
  const [profileImage, setProfileImage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(initialProfile)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingPic, setIsUploadingPic] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    let isActive = true

    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true)
        const response = await api.get('/api/v1/profile')
        const payload = extractProfilePayload(response)

        if (!isActive || !payload) return

        const nextProfile = normalizeProfile(payload)
        setProfile(nextProfile)
        setDraft(nextProfile)
        setProfileImage(payload.profileImageUrl || '')
        setProfileError('')
      } catch (error) {
        if (!isActive) return
        setProfileError(error.message || 'Unable to load your profile.')
      } finally {
        if (isActive) {
          setIsLoadingProfile(false)
        }
      }
    }

    loadProfile()

    return () => {
      isActive = false
    }
  }, [])

  const openEdit = () => {
    setDraft(profile)
    setIsEditing(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setDraft((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      // TODO: replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 900))
      setProfile(draft)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePictureChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingPic(true)
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      // TODO: replace with real upload API call
      await new Promise((resolve) => setTimeout(resolve, 700))
      setProfileImage(dataUrl)
    } finally {
      setIsUploadingPic(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className='profile-container'>
      <Searchbar />
      <Sidebar />
      <div className='profile'>
        <div className='profile-header'>
          <button className='profile-back' onClick={() => navigate('/dashboard')}>
            <IoArrowBackOutline size={20} />
          </button>
          <p>My Profile</p>
        </div>

        {isLoadingProfile ? <p style={{ margin: '8px 0 0 0' }}>Loading profile...</p> : null}
        {profileError ? <p style={{ margin: '8px 0 0 0', color: '#d14343' }}>{profileError}</p> : null}

        <div className='pro-file'>
          <div className='banner'>
            <img src={banner} alt='banner' />
          </div>
          <div className='profile-pic'>
            {profileImage ? (
              <img src={profileImage} alt='profile' />
            ) : (
              <div className='profile-pic-placeholder' aria-label='Unisex profile avatar'>
                <FaUserCircle size={82} />
              </div>
            )}
            <button
              type='button'
              className='profile-pic-edit'
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPic}
              aria-label='Change profile picture'
            >
              {isUploadingPic ? <Spinner /> : <FiCamera size={14} />}
            </button>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              hidden
              onChange={handlePictureChange}
            />
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
              <button className='profile-edit-btn' onClick={openEdit}>
                <FiEdit2 size={13} /> Edit Profile
              </button>
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
            <p><span>Date Joined</span><span>{profile.dateJoined}</span></p>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className='profile-modal-overlay' onClick={() => !isSaving && setIsEditing(false)}>
          <form
            className='profile-modal'
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSave}
          >
            <h3>Edit Profile</h3>

            <div className='profile-form-row'>
              <label>
                <span>First Name</span>
                <input
                  type='text'
                  name='firstName'
                  value={draft.firstName}
                  onChange={handleChange}
                  disabled={isSaving}
                  required
                />
              </label>
              <label>
                <span>Last Name</span>
                <input
                  type='text'
                  name='lastName'
                  value={draft.lastName}
                  onChange={handleChange}
                  disabled={isSaving}
                  required
                />
              </label>
            </div>

            <label>
              <span>Email <FiLock size={11} /> <em>(verified, cannot be changed)</em></span>
              <input
                type='email'
                name='email'
                value={draft.email}
                readOnly
                disabled
                className='input-locked'
              />
            </label>

            <label>
              <span>Gender</span>
              <select
                name='gender'
                value={draft.gender}
                onChange={handleChange}
                disabled={isSaving}
              >
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='not-set'>Prefer not to say</option>
              </select>
            </label>

            <label>
              <span>Phone Number</span>
              <input
                type='text'
                name='phoneNumber'
                value={draft.phoneNumber}
                onChange={handleChange}
                disabled={isSaving}
              />
            </label>

            <label>
              <span>Address</span>
              <input
                type='text'
                name='address'
                value={draft.address}
                onChange={handleChange}
                disabled={isSaving}
              />
            </label>

            <div className='profile-modal-actions'>
              <button
                type='button'
                className='btn-cancel'
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button type='submit' className='btn-save' disabled={isSaving}>
                {isSaving ? (<><Spinner /> Saving...</>) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default UserProfile