import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import '../css/Reports.css'

import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const SORT_FIELDS = [
  { value: 'id',            label: 'Case No.' },
  { value: 'date',          label: 'Date' },
  { value: 'reportedBy',    label: 'Reported By' },
  { value: 'reportedEmail', label: 'Email' },
  { value: 'status',        label: 'Status' },
]

const PAGE_SIZE_OPTIONS = [20, 10, 30, 50]

const Reports = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen,   setIsSortOpen]   = useState(false)

  const [sortField, setSortField] = useState('date')
  const [sortDir,   setSortDir]   = useState('desc')
  const [pendingSortField, setPendingSortField] = useState('date')
  const [pendingSortDir,   setPendingSortDir]   = useState('desc')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])

  const [filters, setFilters] = useState({
    type: '',
    status: '',
    date: '',
  })

  function handleFilterOpen()  { setIsFilterOpen(true) }
  function handleFilterClose() { setIsFilterOpen(false) }
  
  function handleFilterChange(event) {
    const { name, value } = event.target
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }))
  }
  
  function handleResetFilters() {
    setFilters({ type: '', status: '', date: '' })
  }
  
  function handleApplyFilters(event) {
    event.preventDefault()
    handleFilterClose()
  }

  function handleSortOpen() {
    setPendingSortField(sortField)
    setPendingSortDir(sortDir)
    setIsSortOpen(true)
  }
  function handleSortClose() { setIsSortOpen(false) }
  function handleSortApply() {
    setSortField(pendingSortField)
    setSortDir(pendingSortDir)
    setCurrentPage(1)
    setIsSortOpen(false)
  }

  function handleOpenReportDetails(report) {
    const sourcePath = `${location.pathname}${location.search}${location.hash}`
    navigate('/reports/details', { state: { report, from: sourcePath } })
  }

  const tableHead = ["Case No.", "Incident", "Reported By", "Reporter Email", "Status", "Tracking", "Reported Date"]
  const tableContent = [
    { id: "A1208", type: "Sexual Harassment",     reportedBy: "Jane Doe",     reportedEmail: "jane.doe@example.com",    status: "Pending",     date: "02-07-24", width: "10%" },
    { id: "A2051", type: "Gender-based violence", reportedBy: "Wade Warren",  reportedEmail: "wade.warren@example.com", status: "Pending",     date: "22-06-24", width: "5%" },
    { id: "A1208", type: "Sexual Harassment",     reportedBy: "Jenny Wilson", reportedEmail: "jenny.wilson@example.com",status: "In Progress", date: "02-07-24", width: "35%" },
    { id: "A2351", type: "Rape Issues",           reportedBy: "Modupe Aina",  reportedEmail: "modupe.aina@example.com", status: "Resolved",    date: "12-06-24", width: "80%" },
    { id: "A1208", type: "Sexual Harassment",     reportedBy: "Jane Doe",     reportedEmail: "jane.doe@example.com",    status: "Pending",     date: "02-07-24", width: "5%" },
    { id: "A2351", type: "Rape Issues",           reportedBy: "Wade Warren",  reportedEmail: "wade.warren@example.com", status: "Resolved",    date: "12-06-24", width: "80%" },
    { id: "A1208", type: "Sexual Harassment",     reportedBy: "Jenny Wilson", reportedEmail: "jenny.wilson@example.com",status: "Pending",     date: "02-07-24", width: "5%" },
    { id: "A1208", type: "Sexual Harassment",     reportedBy: "Modupe Aina",  reportedEmail: "modupe.aina@example.com", status: "In Progress", date: "02-07-24", width: "35%" },
    { id: "A2351", type: "Rape Issues",           reportedBy: "Jane Doe",     reportedEmail: "jane.doe@example.com",    status: "Closed",      date: "12-06-24", width: "100%" },
    { id: "A2051", type: "Gender-based violence", reportedBy: "Wade Warren",  reportedEmail: "wade.warren@example.com", status: "Pending",     date: "22-06-24", width: "5%" },
    { id: "A2051", type: "Gender-based violence", reportedBy: "Jenny Wilson", reportedEmail: "jenny.wilson@example.com",status: "In Progress", date: "22-06-24", width: "35%" },
    { id: "A1208", type: "Sexual Harassment",     reportedBy: "Modupe Aina",  reportedEmail: "modupe.aina@example.com", status: "Closed",      date: "02-07-24", width: "100%" },
  ]

  const parseDate = (str) => {
    const m = /^([0-9]{2})-([0-9]{2})-([0-9]{2})$/.exec(str || '')
    if (m) return new Date(2000 + Number(m[3]), Number(m[2]) - 1, Number(m[1]))
    return new Date(str)
  }

  const sorted = [...tableContent].sort((a, b) => {
    let valA, valB
    if (sortField === 'date') {
      valA = parseDate(a.date).getTime()
      valB = parseDate(b.date).getTime()
    } else {
      valA = (a[sortField] || '').toLowerCase()
      valB = (b[sortField] || '').toLowerCase()
    }
    if (valA < valB) return sortDir === 'asc' ? -1 : 1
    if (valA > valB) return sortDir === 'asc' ? 1  : -1
    return 0
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const pageItems  = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const startItem = sorted.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = sorted.length === 0 ? 0 : Math.min(currentPage * pageSize, sorted.length)

  return (
    <>
      <div className='reports-container'>
        <Searchbar />
        <Sidebar />
        <div className='reports'>
          <div className='reports-head'>
            <p>Reports</p>
            <div className='head-right'>
              <button onClick={handleSortOpen} aria-label="Sort">
                <FaLongArrowAltUp size={18}/><FaLongArrowAltDown size={18}/>
              </button>
              <button onClick={handleFilterOpen}>
                <HiOutlineAdjustmentsVertical size={20}/>Filter
              </button>
            </div>
          </div>

          <div className='reports-body'>
              <div className='reports-table-shell'>
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
                      <ReportList
                        key={index}
                        id={value.id}
                        type={value.type}
                        reportedBy={value.reportedBy}
                        reportedEmail={value.reportedEmail}
                        status={value.status}
                        date={value.date}
                        width={value.width}
                        onOpenDetails={() => handleOpenReportDetails(value)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className='reports-pagination'>
                <div className='pagination-left'>
                  <p className='pagination-info'>
                    Showing {startItem}&#8211;{endItem} of {sorted.length} reports
                  </p>
                  <div className='page-size-wrap'>
                    <label htmlFor='reports-page-size'>Rows per page</label>
                    <select
                      id='reports-page-size'
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
            </div>

          {isFilterOpen && (
            <div className='reports-filter-modal-overlay' onClick={handleFilterClose}>
              <div className='reports-filter-modal' role='dialog' aria-modal='true' onClick={e => e.stopPropagation()}>
                <div className='reports-filter-modal-head'>
                  <p>Apply Filter</p>
                  <button type='button' className='reports-close-modal-btn' onClick={handleFilterClose} aria-label='Close filter modal'>×</button>
                </div>

                <form className='reports-filter-modal-form' onSubmit={handleApplyFilters}>
                  <label htmlFor='reports-filter-type'>Incident Type</label>
                  <select
                    id='reports-filter-type'
                    name='type'
                    value={filters.type}
                    onChange={handleFilterChange}
                  >
                    <option value=''>All incident types</option>
                    <option value='Sexual Harassment'>Sexual Harassment</option>
                    <option value='Gender-based violence'>Gender-based violence</option>
                    <option value='Rape Issues'>Rape Issues</option>
                  </select>

                  <label htmlFor='reports-filter-status'>Status</label>
                  <select
                    id='reports-filter-status'
                    name='status'
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value=''>All statuses</option>
                    <option value='Pending'>Pending</option>
                    <option value='In Progress'>In Progress</option>
                    <option value='Resolved'>Resolved</option>
                    <option value='Closed'>Closed</option>
                  </select>

                  <label htmlFor='reports-filter-date'>Date</label>
                  <input
                    id='reports-filter-date'
                    name='date'
                    type='date'
                    value={filters.date}
                    onChange={handleFilterChange}
                  />

                  <div className='reports-filter-modal-actions'>
                    <button type='button' className='reports-ghost-btn' onClick={handleResetFilters}>Reset</button>
                    <button type='button' className='reports-ghost-btn' onClick={handleFilterClose}>Cancel</button>
                    <button type='submit' className='reports-apply-btn'>Apply Filter</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isSortOpen && (
            <div className='modal-overlay reports-modal-overlay' onClick={handleSortClose}>
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
    </>
  )
}

function ReportList({ id, type, reportedBy, reportedEmail, status, date, width, onOpenDetails }) {
  let background
  let color

  if (status === "Resolved")        { background = "#48C9B01A"; color = "#48C9B0" }
  else if (status === "Pending")    { background = "#EAC4001A"; color = "#EAC400" }
  else if (status === "In Progress"){ background = "#3DACF51A"; color = "#3DACF5" }
  else if (status === "Closed")     { background = "#9999991A"; color = "#999999" }

  const formatDate = (value) => {
    const parsed = /^([0-9]{2})-([0-9]{2})-([0-9]{2})$/.exec(value || "")
    let d
    if (parsed) {
      d = new Date(2000 + Number(parsed[3]), Number(parsed[2]) - 1, Number(parsed[1]))
    } else {
      d = new Date(value)
    }
    if (Number.isNaN(d.getTime())) return value
    const day     = d.getDate()
    const weekday = d.toLocaleDateString("en-US", { weekday: "short" })
    const month   = d.toLocaleDateString("en-US", { month: "short" })
    const year    = d.getFullYear()
    const suffix  = (n) => {
      if (n >= 11 && n <= 13) return "th"
      switch (n % 10) { case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th" }
    }
    return weekday + ", " + day + suffix(day) + " " + month + " " + year
  }

  return (
    <tr onClick={onOpenDetails}>
      <td>{id}</td>
      <td>{type}</td>
      <td>{reportedBy}</td>
      <td>{reportedEmail}</td>
      <td><span style={{ color, background }} className='status'>{status}</span></td>
      <td>
        <div className='progress-bar'>
          <div className='progress' style={{ width }}></div>
        </div>
      </td>
      <td>{formatDate(date)}</td>
    </tr>
  )
}

export default Reports
