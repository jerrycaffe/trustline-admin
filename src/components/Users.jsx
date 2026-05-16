import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../css/Users.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import { api } from '../services/api'

import { FaLongArrowAltDown, FaLongArrowAltUp, FaMale, FaFemale, FaUser } from "react-icons/fa";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const SORT_FIELDS = [
  { value: 'name', label: 'Name' },
  { value: 'gender', label: 'Gender' },
  { value: 'dateRegistered', label: 'Date Registered' },
  { value: 'ongoingCases', label: 'Ongoing Cases' },
]

const PAGE_SIZE_OPTIONS = [20, 10, 30, 50]

const extractUsersResponse = (response) => {
  const directItems = Array.isArray(response) ? response : null
  const dataObject = response?.data && typeof response.data === 'object' ? response.data : null

  const items = directItems
    || (Array.isArray(response?.data) ? response.data : null)
    || (Array.isArray(dataObject?.content) ? dataObject.content : null)
    || (Array.isArray(dataObject?.items) ? dataObject.items : null)
    || (Array.isArray(dataObject?.users) ? dataObject.users : null)
    || []

  const totalRaw =
    response?.total
    ?? dataObject?.total
    ?? response?.count
    ?? dataObject?.count
    ?? response?.totalCount
    ?? dataObject?.totalCount

  const total = Number(totalRaw)

  return {
    items,
    total: Number.isFinite(total) ? total : items.length,
  }
}

const normalizeUser = (user) => {
  if (!user || typeof user !== 'object') {
    return null
  }

  const firstName = String(user.firstName || '').trim()
  const lastName = String(user.lastName || '').trim()
  const email = String(user.email || '').trim()
  const fallbackName = email ? email.split('@')[0] : 'Unknown User'
  const fullName = `${firstName} ${lastName}`.trim() || fallbackName

  const roles = Array.isArray(user.roles)
    ? user.roles.map((role) => String(role || '').trim()).filter(Boolean)
    : []

  const rawDateValue = user.createdAt || user.dateRegistered || user.dateJoined || ''
  const parsedDate = rawDateValue ? new Date(rawDateValue) : null
  const hasValidDate = Boolean(parsedDate && !Number.isNaN(parsedDate.getTime()))

  const normalizedGender = String(user.gender || '').toLowerCase()
  const gender = normalizedGender === 'male' || normalizedGender === 'female'
    ? normalizedGender
    : 'not-set'

  return {
    id: user.userId ?? user.id ?? user._id ?? `user-${Date.now()}`,
    firstName: firstName || fallbackName,
    lastName,
    name: fullName,
    email: email || 'Not available',
    gender,
    phoneNumber: user.phoneNumber || 'Not available',
    dateRegistered: hasValidDate
      ? parsedDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      : 'N/A',
    dateRegisteredISO: hasValidDate ? parsedDate.toISOString().slice(0, 10) : '',
    dateRegisteredUnix: hasValidDate ? parsedDate.getTime() : 0,
    ongoingCases: Number(user.ongoingCases ?? 0) || 0,
    status: String(user.status || 'Unknown'),
    roles,
    unit: user.unit || 'Unassigned',
    adminId: user.userId || 'N/A',
    position: roles[0] || 'User',
  }
}

const Users = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const [pendingSortField, setPendingSortField] = useState('name')
  const [pendingSortDir, setPendingSortDir] = useState('asc')

  const [filtersDraft, setFiltersDraft] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    verifiedStatus: '',
  })
  const [appliedFilters, setAppliedFilters] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    verifiedStatus: '',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [users, setUsers] = useState([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [totalUsers, setTotalUsers] = useState(0)

  const tableHead = ["Name","Gender","Email","Phone Number","Date Registered","Ongoing Cases", "Status"]

  useEffect(() => {
    let isActive = true

    const loadUsers = async () => {
      setIsLoadingUsers(true)

      try {
        const params = new URLSearchParams()
        params.set('offset', String(Math.max(0, (currentPage - 1) * pageSize)))
        params.set('limit', String(pageSize))

        if (appliedFilters.email.trim()) {
          params.set('email', appliedFilters.email.trim())
        }

        if (appliedFilters.firstName.trim()) {
          params.set('firstName', appliedFilters.firstName.trim())
        }

        if (appliedFilters.lastName.trim()) {
          params.set('lastName', appliedFilters.lastName.trim())
        }

        if (appliedFilters.gender) {
          params.set('gender', String(appliedFilters.gender).toUpperCase())
        }

        if (appliedFilters.verifiedStatus) {
          params.set('verifiedStatus', appliedFilters.verifiedStatus)
        }

        const response = await api.get(`/api/v1/admin/users?${params.toString()}`)
        const { items, total } = extractUsersResponse(response)
        const normalizedUsers = items
          .map(normalizeUser)
          .filter(Boolean)

        if (!isActive) return
        setUsers(normalizedUsers)
        setTotalUsers(total)
      } catch (error) {
        if (!isActive) return
        setUsers([])
        setTotalUsers(0)
      } finally {
        if (isActive) {
          setIsLoadingUsers(false)
        }
      }
    }

    loadUsers()

    return () => {
      isActive = false
    }
  }, [appliedFilters, currentPage, pageSize])

  function handleFilterOpen() { setIsFilterOpen(true) }
  function handleFilterClose() { setIsFilterOpen(false) }
  
  function handleFilterChange(event) {
    const { name, value } = event.target
    setFiltersDraft(prev => ({
      ...prev,
      [name]: value,
    }))
  }
  
  function handleResetFilters() {
    const resetFilters = {
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      verifiedStatus: '',
    }

    setFiltersDraft(resetFilters)
    setAppliedFilters(resetFilters)
    setCurrentPage(1)
  }
  
  function handleApplyFilters(event) {
    event.preventDefault()
    setAppliedFilters({
      firstName: filtersDraft.firstName,
      lastName: filtersDraft.lastName,
      email: filtersDraft.email,
      gender: filtersDraft.gender,
      verifiedStatus: filtersDraft.verifiedStatus,
    })
    setCurrentPage(1)
    handleFilterClose()
  }

  function handleSortOpen() { setIsSortOpen(true) }
  function handleSortClose() { setIsSortOpen(false) }
  function handleSortApply() {
    setCurrentPage(1)
    setIsSortOpen(false)
  }

  const sortedUsers = [...users].sort((a, b) => {
    let comparison = 0

    if (pendingSortField === 'name') {
      comparison = a.name.localeCompare(b.name)
    } else if (pendingSortField === 'gender') {
      comparison = a.gender.localeCompare(b.gender)
    } else if (pendingSortField === 'dateRegistered') {
      comparison = (a.dateRegisteredUnix || 0) - (b.dateRegisteredUnix || 0)
    } else if (pendingSortField === 'ongoingCases') {
      comparison = (a.ongoingCases || 0) - (b.ongoingCases || 0)
    }

    return pendingSortDir === 'desc' ? comparison * -1 : comparison
  })

  const allUsersContent = sortedUsers
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize))
  const pageItems = allUsersContent
  const startItem = totalUsers === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = totalUsers === 0 ? 0 : Math.min(currentPage * pageSize, totalUsers)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

function handleOpenUserDetails(user) {
  const sourcePath = `${location.pathname}${location.search}${location.hash}`
  navigate(`/users/details/${user.id}`, { state: { user, from: sourcePath } })
}

  return (
    <div className='users-container'>
      <Searchbar />
      <Sidebar />
      <div className='users'>
        <div className='header'>
          <p>User Management</p>
          <div className='head-right'>
            <button onClick={handleSortOpen} aria-label="Sort">
              <FaLongArrowAltUp size={18}/><FaLongArrowAltDown size={18}/>
            </button>
            <button onClick={handleFilterOpen} aria-label="Filter">
              <HiOutlineAdjustmentsVertical size={20}/>Filter
            </button>
          </div>
        </div>

        <div className='users-body'>
          <div className='users-table-shell'>
            <table>
              <thead>
                <tr>
                  {tableHead.map((value, index) => (
                    <th key={index}>{value}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoadingUsers ? (
                  <tr>
                    <td colSpan={tableHead.length}>Loading users...</td>
                  </tr>
                ) : null}

                {!isLoadingUsers && pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={tableHead.length}>No users found.</td>
                  </tr>
                ) : null}

                {!isLoadingUsers && pageItems.map((value) => (
                <List 
                  key={value.id}
                  user={value}
                  gender={value.gender}
                  name={value.name}
                  email={value.email}
                  phoneNumber={value.phoneNumber}
                  dateRegistered={value.dateRegistered}
                  ongoingCases={value.ongoingCases}
                  status={value.status}
                  onOpenDetails={handleOpenUserDetails}
                /> 
                ))}
              </tbody>
            </table>
          </div>
          
          <div className='users-pagination'>
            <div className='pagination-left'>
              <p className='pagination-info'>
                Showing {startItem}&#8211;{endItem} of {totalUsers} users
              </p>
              <div className='page-size-wrap'>
                <label htmlFor='users-page-size'>Rows per page</label>
                <select
                  id='users-page-size'
                  className='page-size-select'
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className='pagination-controls'>
              <button
                className='page-btn'
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <MdKeyboardArrowLeft size={18}/>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={page === currentPage ? 'page-btn is-active' : 'page-btn'}
                  onClick={() => setCurrentPage(page)}
                  aria-label={"Page " + page}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}
              <button
                className='page-btn'
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <MdKeyboardArrowRight size={18}/>
              </button>
            </div>
          </div>

          {isFilterOpen && (
            <div className='users-filter-modal-overlay' onClick={handleFilterClose}>
              <div className='users-filter-modal' role='dialog' aria-modal='true' onClick={e => e.stopPropagation()}>
                <div className='users-filter-modal-head'>
                  <p>Apply Filter</p>
                  <button type='button' className='users-close-modal-btn' onClick={handleFilterClose} aria-label='Close filter modal'>×</button>
                </div>

                <form onSubmit={handleApplyFilters} className='users-filter-modal-form'>
                  <label htmlFor='users-filter-first-name'>First Name</label>
                  <input
                    id='users-filter-first-name'
                    name='firstName'
                    type='search'
                    placeholder='Search first name'
                    value={filtersDraft.firstName}
                    onChange={handleFilterChange}
                  />

                  <label htmlFor='users-filter-last-name'>Last Name</label>
                  <input
                    id='users-filter-last-name'
                    name='lastName'
                    type='search'
                    placeholder='Search last name'
                    value={filtersDraft.lastName}
                    onChange={handleFilterChange}
                  />

                  <label htmlFor='users-filter-email'>Email</label>
                  <input
                    id='users-filter-email'
                    name='email'
                    type='search'
                    placeholder='Search email'
                    value={filtersDraft.email}
                    onChange={handleFilterChange}
                  />

                  <label htmlFor='users-filter-gender'>Gender</label>
                  <select
                    id='users-filter-gender'
                    name='gender'
                    value={filtersDraft.gender}
                    onChange={handleFilterChange}
                  >
                    <option value=''>All genders</option>
                    <option value='MALE'>Male</option>
                    <option value='FEMALE'>Female</option>
                  </select>

                  <label htmlFor='users-filter-verified-status'>Verified Status</label>
                  <select
                    id='users-filter-verified-status'
                    name='verifiedStatus'
                    value={filtersDraft.verifiedStatus}
                    onChange={handleFilterChange}
                  >
                    <option value=''>All</option>
                    <option value='true'>Verified</option>
                    <option value='false'>Unverified</option>
                  </select>

                  <div className='users-filter-modal-actions'>
                    <button type='button' className='users-ghost-btn' onClick={handleResetFilters}>Reset</button>
                    <button type='button' className='users-ghost-btn' onClick={handleFilterClose}>Cancel</button>
                    <button type='submit' className='users-apply-btn'>Apply Filter</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isSortOpen && (
            <div className='modal-overlay users-modal-overlay' onClick={handleSortClose}>
              <div className='sort-card' onClick={e => e.stopPropagation()}>
                <div className='sort-card-head'>
                  <p>Sort By</p>
                  <button type='button' className='sort-close-btn' onClick={handleSortClose} aria-label="Close sort">
                    <IoMdClose size={20}/>
                  </button>
                </div>

                <div className='sort-section'>
                  <p className='sort-section-label'>Field</p>
                  <div className='sort-field-grid'>
                    {SORT_FIELDS.map(field => (
                      <button
                        key={field.value}
                        type='button'
                        className={pendingSortField === field.value ? 'sort-field-btn is-active' : 'sort-field-btn'}
                        onClick={() => setPendingSortField(field.value)}
                      >
                        {field.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='sort-section'>
                  <p className='sort-section-label'>Order</p>
                  <div className='sort-dir-row'>
                    <button
                      type='button'
                      className={pendingSortDir === 'asc' ? 'sort-dir-btn is-active' : 'sort-dir-btn'}
                      onClick={() => setPendingSortDir('asc')}
                    >
                      <FaLongArrowAltUp size={13}/> Ascending
                    </button>
                    <button
                      type='button'
                      className={pendingSortDir === 'desc' ? 'sort-dir-btn is-active' : 'sort-dir-btn'}
                      onClick={() => setPendingSortDir('desc')}
                    >
                      <FaLongArrowAltDown size={13}/> Descending
                    </button>
                  </div>
                </div>

                <button className='sort-apply-btn' onClick={handleSortApply}>Apply Sort</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const AVATAR_CONFIG = {
  male:    { Icon: FaMale,   bg: '#dbeafe', color: '#3b82f6' },
  female:  { Icon: FaFemale, bg: '#fce7f3', color: '#ec4899' },
  'not-set': { Icon: FaUser, bg: '#f1f5f9', color: '#94a3b8' },
  unknown: { Icon: FaUser,   bg: '#f1f5f9', color: '#94a3b8' },
}

function GenderAvatar({ gender }) {
  const { Icon, bg, color } = AVATAR_CONFIG[gender] || AVATAR_CONFIG.unknown
  return (
    <span className='user-avatar' style={{ background: bg }}>
      <Icon size={16} color={color} />
    </span>
  )
}

function  List({ user, gender, name, email, phoneNumber, dateRegistered, ongoingCases, status, onOpenDetails }){
  return(
    <>
  <tr onClick={() => onOpenDetails(user)}>
    <td className='name'><GenderAvatar gender={gender} />{name}</td>
    <td>{gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : 'Not Set'}</td>
    <td>{email}</td>
    <td>{phoneNumber}</td>
    <td>{dateRegistered}</td>
    <td>{ongoingCases}</td>
    <td>
      <span className={`users-status ${String(status || '').toLowerCase()}`}>{status || 'Unknown'}</span>
    </td>
  </tr>
  </>)
}

export default Users 