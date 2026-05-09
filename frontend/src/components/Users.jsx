import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../css/Users.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import aina from '../assets/aina.png'
import wade from '../assets/wade.png'
import jenny from '../assets/jenny.png'
import jane from '../assets/jane.png'
import profilepic from '../assets/profilepic.png'

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

const Users = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const [pendingSortField, setPendingSortField] = useState('name')
  const [pendingSortDir, setPendingSortDir] = useState('asc')

  const [filters, setFilters] = useState({
    gender: '',
    dateRegistered: '',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])

  const tableHead = ["Name","Gender","Email","Phone Number","Date Registered","Ongoing Cases"]

  function handleFilterOpen() { setIsFilterOpen(true) }
  function handleFilterClose() { setIsFilterOpen(false) }
  
  function handleFilterChange(event) {
    const { name, value } = event.target
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }))
  }
  
  function handleResetFilters() {
    setFilters({ gender: '', dateRegistered: '' })
  }
  
  function handleApplyFilters(event) {
    event.preventDefault()
    handleFilterClose()
  }

  function handleSortOpen() { setIsSortOpen(true) }
  function handleSortClose() { setIsSortOpen(false) }
  function handleSortApply() {
    setCurrentPage(1)
    setIsSortOpen(false)
  }

const topTableContent = [
  {
  image:jenny,
   gender:"female",
   name:"Jenny Wilson",
   email: "jennywilson@gmail.com",
   phoneNumber: "+234 811 345 2201",
   dateRegistered: "12th June, 2024",
   ongoingCases:"0",
  },
  {
    image:wade,
   gender:"male",
   name:"Wade Warren",
   email: "wadewarren@gmail.com",
   phoneNumber: "+234 803 445 2245",
   dateRegistered: "5th July, 2024",
   ongoingCases:"0",
  },
]

const secondTableContent = [
  {
  image:aina,
   gender:"female",
   name:"Modupe Aina",
   email: "modupe077@gmail.com",
   phoneNumber: "+234 801 886 7528",
   dateRegistered: "12th June, 2024",
   ongoingCases:"3",
  },
  {
    image:aina,
   gender:"female",
   name:"Modupe Aina",
   email: "modupe077@gmail.com",
   phoneNumber: "+234 801 886 7528",
   dateRegistered: "12th June, 2024",
   ongoingCases:"3",
  },
  {
    image:jane,
   gender:"female",
   name:"Jane Doe",
   email: "janedoe@gmail.com",
   phoneNumber: "+234 808 100 9920",
   dateRegistered: "20th May, 2024",
   ongoingCases:"1",
  },
  {
    image:profilepic,
   gender:"not-set",
   name:"Jane Doe",
   email: "janedoe@gmail.com",
   phoneNumber: "+234 808 100 9920",
   dateRegistered: "20th May, 2024",
   ongoingCases:"1",
  },
  {
    image:jenny,
   gender:"female",
   name:"Jenny Wilson",
   email: "jennywilson@gmail.com",
   phoneNumber: "+234 811 345 2201",
   dateRegistered: "12th June, 2024",
   ongoingCases:"0",
  },
  {
    image:profilepic,
   gender:"not-set",
   name:"Jenny Wilson",
   email: "jennywilson@gmail.com",
   phoneNumber: "+234 811 345 2201",
   dateRegistered: "12th June, 2024",
   ongoingCases:"0",
  },
  {
    image:wade,
   gender:"male",
   name:"Wade Warren",
   email: "wadewarren@gmail.com",
   phoneNumber: "+234 803 445 2245",
   dateRegistered: "5th July, 2024",
   ongoingCases:"4",
  },
  {
    image:wade,
   gender:"male",
   name:"Wade Warren",
   email: "wadewarren@gmail.com",
   phoneNumber: "+234 803 445 2245",
   dateRegistered: "5th July, 2024",
   ongoingCases:"4",
  },
]

const allUsersContent = [...topTableContent, ...secondTableContent]

const totalPages = Math.max(1, Math.ceil(allUsersContent.length / pageSize))
const pageItems = allUsersContent.slice((currentPage - 1) * pageSize, currentPage * pageSize)
const startItem = allUsersContent.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
const endItem = allUsersContent.length === 0 ? 0 : Math.min(currentPage * pageSize, allUsersContent.length)

function handleOpenUserDetails(user) {
  const sourcePath = `${location.pathname}${location.search}${location.hash}`
  navigate('/users/details', { state: { user, from: sourcePath } })
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
                {pageItems.map((value, index) => (
                <List 
                  key={index}
                  user={value}
                  gender={value.gender}
                  name={value.name}
                  email={value.email}
                  phoneNumber={value.phoneNumber}
                  dateRegistered={value.dateRegistered}
                  ongoingCases={value.ongoingCases}
                  onOpenDetails={handleOpenUserDetails}
                /> 
                ))}
              </tbody>
            </table>
          </div>
          
          <div className='users-pagination'>
            <div className='pagination-left'>
              <p className='pagination-info'>
                Showing {startItem}&#8211;{endItem} of {allUsersContent.length} users
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
                  <label htmlFor='users-filter-gender'>Gender</label>
                  <select
                    id='users-filter-gender'
                    name='gender'
                    value={filters.gender}
                    onChange={handleFilterChange}
                  >
                    <option value=''>All genders</option>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    <option value='not-set'>Not Set</option>
                  </select>

                  <label htmlFor='users-filter-date'>Date Registered</label>
                  <input
                    id='users-filter-date'
                    name='dateRegistered'
                    type='date'
                    value={filters.dateRegistered}
                    onChange={handleFilterChange}
                  />

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

function  List({ user, gender, name, email, phoneNumber, dateRegistered, ongoingCases, onOpenDetails }){
  return(
    <>
  <tr onClick={() => onOpenDetails(user)}>
    <td className='name'><GenderAvatar gender={gender} />{name}</td>
    <td>{gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : 'Not Set'}</td>
    <td>{email}</td>
    <td>{phoneNumber}</td>
    <td>{dateRegistered}</td>
    <td>{ongoingCases}</td>
  </tr>
  </>)
}

export default Users 