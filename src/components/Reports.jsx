import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import '../css/Reports.css'
import { api } from '../services/api'
import toast from 'react-hot-toast'

import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineInbox } from "react-icons/md";

const SORT_FIELDS = [
  { value: 'displayCaseNumber', label: 'Case No.' },
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
  const [cases, setCases] = useState([])
  const [paginationMeta, setPaginationMeta] = useState({
    count: 0,
    total: 0,
    last: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [incidentTypes, setIncidentTypes] = useState([])

  const [filters, setFilters] = useState({
    incidentTypeId: '',
    status: '',
    startDate: '',
    endDate: '',
  })
  const [appliedFilters, setAppliedFilters] = useState({
    incidentTypeId: '',
    status: '',
    startDate: '',
    endDate: '',
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
    setFilters({ incidentTypeId: '', status: '', startDate: '', endDate: '' })
  }
  
  function handleApplyFilters(event) {
    event.preventDefault()
    setAppliedFilters({ ...filters })
    setCurrentPage(1)
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
    const detailsCaseId = report?.caseId || report?.id
    const targetPath = detailsCaseId ? `/reports/details/${detailsCaseId}` : '/reports/details'
    navigate(targetPath, { state: { report, from: sourcePath } })
  }

  const tableHead = ["Case No.", "Incident", "Reported By", "Reporter Email", "Status", "Tracking", "Reported Date"]

  useEffect(() => {
    const fetchCases = async () => {
      setIsLoading(true)

      try {
        const query = new URLSearchParams({
          offset: String(Math.max(0, (currentPage - 1) * pageSize)),
          limit: String(pageSize),
        })

        if (appliedFilters.incidentTypeId) {
          query.append('incidentTypeId', appliedFilters.incidentTypeId)
        }
        if (appliedFilters.status) {
          query.append('status', appliedFilters.status)
        }
        if (appliedFilters.startDate) {
          query.append('startDate', appliedFilters.startDate)
        }
        if (appliedFilters.endDate) {
          query.append('endDate', appliedFilters.endDate)
        }

        const response = await api.get(`/api/v1/cases?${query.toString()}`)
        const data = response?.data || {}
        const content = Array.isArray(data.content) ? data.content : []

        setCases(content)
        setPaginationMeta({
          count: Number(data.count ?? content.length) || 0,
          total: Number(data.total ?? content.length) || 0,
          last: Boolean(data.last),
        })
      } catch (error) {
        setCases([])
        setPaginationMeta({ count: 0, total: 0, last: true })
        toast.error(error?.message || 'Unable to fetch reports at the moment.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCases()
  }, [currentPage, pageSize, appliedFilters])

  useEffect(() => {
    const fetchIncidentTypes = async () => {
      try {
        const response = await api.get('/api/v1/incident-types')
        const data = Array.isArray(response?.data) ? response.data : []
        const normalizedIncidentTypes = data
          .filter((item) => item?.id && item?.name)
          .map((item) => ({ id: item.id, name: item.name }))

        setIncidentTypes(normalizedIncidentTypes)
      } catch {
        setIncidentTypes([])
        toast.error('Unable to load incident types.')
      }
    }

    fetchIncidentTypes()
  }, [])

  const mappedRows = useMemo(() => {
    return cases.map((caseItem) => {
      const trackingValue = Number(caseItem?.tracking)
      const normalizedTracking = Number.isFinite(trackingValue)
        ? (trackingValue <= 1 ? trackingValue * 100 : trackingValue)
        : 0
      const trackingPercent = Math.min(100, Math.max(0, Math.round(normalizedTracking)))

      return {
        ...caseItem,
        caseId: caseItem?.id || '',
        displayCaseNumber: caseItem?.caseNumber || 'N/A',
        type: caseItem?.incidentType || 'N/A',
        reportedBy: caseItem?.reportedBy || 'N/A',
        reportedEmail: caseItem?.reportedBy || 'N/A',
        status: caseItem?.status || 'N/A',
        date: caseItem?.createdAt || caseItem?.dateOfIncident || '',
        trackingPercent,
      }
    })
  }, [cases])

  const sortedRows = useMemo(() => {
    return [...mappedRows].sort((a, b) => {
      let valA
      let valB

      if (sortField === 'date') {
        valA = new Date(a.date).getTime()
        valB = new Date(b.date).getTime()
      } else {
        valA = String(a[sortField] || '').toLowerCase()
        valB = String(b[sortField] || '').toLowerCase()
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1
      if (valA > valB) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [mappedRows, sortDir, sortField])

  const totalReports = Math.max(0, Number(paginationMeta.total) || 0)
  const totalPages = Math.max(1, Math.ceil(totalReports / pageSize))
  const pageItems = sortedRows
  const startItem = totalReports === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = totalReports === 0 ? 0 : Math.min((currentPage - 1) * pageSize + paginationMeta.count, totalReports)

  const visiblePageButtons = useMemo(() => {
    const maxButtons = 7
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    const half = Math.floor(maxButtons / 2)
    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + maxButtons - 1)

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index)
  }, [currentPage, totalPages])

  const hasNoReports = !isLoading && pageItems.length === 0

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
                    {!isLoading && pageItems.map((value) => (
                      <ReportList
                        key={value.caseId || value.displayCaseNumber}
                        id={value.displayCaseNumber}
                        type={value.type}
                        reportedBy={value.reportedBy}
                        reportedEmail={value.reportedEmail}
                        status={value.status}
                        date={value.date}
                        trackingPercent={value.trackingPercent}
                        onOpenDetails={() => handleOpenReportDetails(value)}
                      />
                    ))}
                    {isLoading && (
                      <tr>
                        <td colSpan={7}>Loading reports...</td>
                      </tr>
                    )}
                    {hasNoReports && (
                      <tr>
                        <td colSpan={7} className='reports-empty-cell'>
                          <div className='reports-empty-state'>
                            <MdOutlineInbox size={40} className='reports-empty-icon' aria-hidden='true' />
                            <p>No reports found.</p>
                            <span>Try adjusting your filters or date range.</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className='reports-pagination'>
                <div className='pagination-left'>
                  <p className='pagination-info'>
                    Showing {startItem}&#8211;{endItem} of {totalReports} reports
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
                    disabled={currentPage === 1 || isLoading}
                    aria-label="Previous page"
                  >
                    <MdKeyboardArrowLeft size={18}/>
                  </button>
                  {visiblePageButtons.map(page => (
                    <button
                      key={page}
                      className={page === currentPage ? 'page-btn is-active' : 'page-btn'}
                      onClick={() => setCurrentPage(page)}
                      disabled={isLoading}
                      aria-label={"Page " + page}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className='page-btn'
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={paginationMeta.last || currentPage === totalPages || isLoading}
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
                    name='incidentTypeId'
                    value={filters.incidentTypeId}
                    onChange={handleFilterChange}
                  >
                    <option value=''>All incident types</option>
                    {incidentTypes.map((incidentType) => (
                      <option key={incidentType.id} value={incidentType.id}>{incidentType.name}</option>
                    ))}
                  </select>

                  <label htmlFor='reports-filter-status'>Status</label>
                  <select
                    id='reports-filter-status'
                    name='status'
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value=''>All statuses</option>
                    <option value='VERIFIED'>VERIFIED</option>
                    <option value='COMPLETED'>COMPLETED</option>
                    <option value='DISCONTINUED'>DISCONTINUED</option>
                    <option value='UNVERIFIED'>UNVERIFIED</option>
                    <option value='PENDING'>PENDING</option>
                  </select>

                  <label htmlFor='reports-filter-start-date'>Start Date</label>
                  <input
                    id='reports-filter-start-date'
                    name='startDate'
                    type='date'
                    value={filters.startDate}
                    onChange={handleFilterChange}
                  />

                  <label htmlFor='reports-filter-end-date'>End Date</label>
                  <input
                    id='reports-filter-end-date'
                    name='endDate'
                    type='date'
                    value={filters.endDate}
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

function ReportList({ id, type, reportedBy, reportedEmail, status, date, trackingPercent, onOpenDetails }) {
  let background
  let color
  const normalizedStatus = String(status || '').toUpperCase()

  if (normalizedStatus === 'VERIFIED')             { background = '#3DACF51A'; color = '#3DACF5' }
  else if (normalizedStatus === 'COMPLETED')       { background = '#48C9B01A'; color = '#48C9B0' }
  else if (normalizedStatus === 'DISCONTINUED')    { background = '#9999991A'; color = '#999999' }
  else if (normalizedStatus === 'UNVERIFIED')      { background = '#EAC4001A'; color = '#EAC400' }
  else if (normalizedStatus === 'PENDING')         { background = '#F973161A'; color = '#F97316' }
  else                                              { background = '#9999991A'; color = '#999999' }

  const statusLabel = String(status || 'N/A').replace(/_/g, ' ')

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
      <td><span style={{ color, background }} className='status'>{statusLabel}</span></td>
      <td>
        <div className='progress-bar'>
          <div className='progress' style={{ width: `${trackingPercent}%` }}></div>
        </div>
      </td>
      <td>{formatDate(date)}</td>
    </tr>
  )
}

export default Reports
