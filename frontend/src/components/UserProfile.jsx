import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/UserProfile.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import { IoArrowBackOutline } from 'react-icons/io5'
import { FiCamera, FiEdit2, FiLock } from 'react-icons/fi'
import { FaCheckCircle } from 'react-icons/fa'
import { MdOutlineErrorOutline } from 'react-icons/md'

import profilePic from '../assets/profilepic.png'
import banner from '../assets/banner.png'

const initialProfile = {
  firstName: 'Jessica',
  lastName: 'Wang',
  position: 'Support Staff',
  adminId: '203',
  email: 'jessicawang96@yahoo.com',
  gender: 'female',
  address: 'N/A',
  phoneNumber: '+234 801 886 7528',
  unit: 'Gender-based Violence Unit',
  dateJoined: '12th August, 2024',
  isAccountVerified: true,
}

const genderLabel = (g) => (g === 'male' ? 'Male' : g === 'female' ? 'Female' : 'Not Set')

const Spinner = () => <span className='profile-spinner' aria-hidden='true' />

const UserProfile = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [profile, setProfile] = useState(initialProfile)
  const [profileImage, setProfileImage] = useState(profilePic)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(initialProfile)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingPic, setIsUploadingPic] = useState(false)

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

        <div className='pro-file'>
          <div className='banner'>
            <img src={banner} alt='banner' />
          </div>
          <div className='profile-pic'>
            <img src={profileImage} alt='profile' />
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