import React, { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import '../css/ReportDetails.css'
import { api } from '../services/api'
import toast from 'react-hot-toast'

import warning from '../assets/warningOrangeBg.png'

import { IoArrowBackOutline } from 'react-icons/io5'
import { IoMdAdd, IoMdClose } from 'react-icons/io'
import { MdOutlineFileDownload } from 'react-icons/md'
import { FaRegFolderOpen } from 'react-icons/fa'

const ReportDetails = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { caseId } = useParams()
  const { state } = location
  const [report, setReport] = useState(state?.report || null)
  const [isLoadingReport, setIsLoadingReport] = useState(false)
  const returnTo = state?.from || '/reports'

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false)
  const [isCloseCaseModalOpen, setIsCloseCaseModalOpen] = useState(false)
  const [isClosingCase, setIsClosingCase] = useState(false)
  const [isReopenCaseModalOpen, setIsReopenCaseModalOpen] = useState(false)
  const [isReopeningCase, setIsReopeningCase] = useState(false)
  const [isConcludeModalOpen, setIsConcludeModalOpen] = useState(false)
  const [isConcludingCase, setIsConcludingCase] = useState(false)
  const [concludeNote, setConcludeNote] = useState('')
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false)
  const [units, setUnits] = useState([])
  const [isLoadingUnits, setIsLoadingUnits] = useState(false)
  const [activeImagePreview, setActiveImagePreview] = useState(null)
  const [updateFormData, setUpdateFormData] = useState({
    nextUnitId: '',
    comment: '',
  })

  useEffect(() => {
    if (!caseId) {
      return
    }

    const fetchCaseDetails = async () => {
      setIsLoadingReport(true)
      try {
        const response = await api.get(`/api/v1/cases/${caseId}`)
        const caseData = response?.data || null
        if (caseData) {
          setReport(caseData)
        }
      } catch (error) {
        toast.error(error?.message || 'Unable to load case details.')
      } finally {
        setIsLoadingReport(false)
      }
    }

    fetchCaseDetails()
  }, [caseId])

  useEffect(() => {
    const fetchUnits = async () => {
      setIsLoadingUnits(true)
      try {
        const response = await api.get('/api/v1/units')
        const unitsData = Array.isArray(response?.data) ? response.data : []
        setUnits(unitsData)
      } catch (error) {
        toast.error(error?.message || 'Unable to load units.')
        setUnits([])
      } finally {
        setIsLoadingUnits(false)
      }
    }

    fetchUnits()
  }, [])

  if (!report && !isLoadingReport) {
    return <Navigate to="/reports" replace />
  }

  if (!report && isLoadingReport) {
    return (
      <div className="report-details-container">
        <Searchbar />
        <Sidebar />
        <div className="report-details-page">
          <p>Loading case details...</p>
        </div>
      </div>
    )
  }

  const getOrdinalSuffix = (number) => {
    if (number >= 11 && number <= 13) {
      return 'th'
    }

    switch (number % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }

  const formatDateTime = (value) => {
    if (!value) {
      return 'Not available'
    }

    const d = new Date(value)
    if (Number.isNaN(d.getTime())) {
      return value
    }

    const day = d.getDate()
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' })
    const month = d.toLocaleDateString('en-US', { month: 'short' })
    const year = d.getFullYear()
    const time = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    return `${weekday}, ${day}${getOrdinalSuffix(day)} ${month} ${year}, ${time}`
  }

  const displayValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return 'Not available'
    }
    return String(value)
  }

  const resolveUnitName = (unitValue) => {
    if (unitValue === null || unitValue === undefined || unitValue === '') {
      return 'Not available'
    }

    const rawValue = String(unitValue).trim()
    const matchedUnit = units.find((unit) => String(unit?.id || '') === rawValue)

    if (matchedUnit?.name) {
      return matchedUnit.name
    }

    return rawValue
  }

  const reportData = {
    id: report.id,
    caseNumber: report.caseNumber,
    incidentType: report.incidentType || report.type,
    dateOfIncident: report.dateOfIncident,
    location: report.location,
    description: report.description,
    reportedBy: report.reportedBy,
    reporterEmail: report.reporterEmail || report.reportedEmail || report.email,
    status: report.status,
    closed: report.closed,
    currentUnit: report.currentUnit,
    nextUnit: report.nextUnit,
    files: Array.isArray(report.files) ? report.files : [],
    comments: Array.isArray(report.comments) ? report.comments : [],
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
  }

  const filesToRender = Array.isArray(reportData.files) ? reportData.files : []
  const commentsToRender = Array.isArray(reportData.comments) ? reportData.comments : []
  const descriptionText = reportData.description || 'Not available'

  const getFileUrl = (file) => {
    if (typeof file === 'string') {
      return file
    }

    return file?.url || file?.fileUrl || file?.path || ''
  }

  const getFileName = (file, index) => {
    if (typeof file === 'string') {
      return `File ${index + 1}`
    }

    return file?.name || file?.id || `File ${index + 1}`
  }

  const isImageFile = (file) => {
    if (typeof file !== 'string') {
      const mimeType = (file?.mimeType || file?.type || '').toLowerCase()
      if (mimeType.startsWith('image/')) {
        return true
      }
    }

    const fileUrl = getFileUrl(file).split('?')[0].toLowerCase()
    return /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/.test(fileUrl)
  }

  const handleFilePreview = (file, index) => {
    if (!isImageFile(file)) {
      return
    }

    const fileUrl = getFileUrl(file)
    if (!fileUrl) {
      return
    }

    setActiveImagePreview({
      src: fileUrl,
      alt: getFileName(file, index),
    })
  }

  const handleUpdateFormChange = (event) => {
    const { name, value } = event.target
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUpdateFormSubmit = async (event) => {
    event.preventDefault()

    if (!caseId) {
      return
    }

    setIsSubmittingUpdate(true)

    try {
      const response = await api.post(
        `/api/v1/cases/${caseId}/comments`,
        {
          comment: updateFormData.comment,
          nextUnitId: updateFormData.nextUnitId,
        },
        { auth: true },
      )

      if (response?.success) {
        const updatedResponse = await api.get(`/api/v1/cases/${caseId}`)

        if (updatedResponse?.data) {
          setReport(updatedResponse.data)
        }

        toast.success('Case updated successfully')
        setUpdateFormData({ nextUnitId: '', comment: '' })
        setIsUpdateModalOpen(false)
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to update case')
    } finally {
      setIsSubmittingUpdate(false)
    }
  }

  const handleCloseCase = async () => {
    if (!caseId) return

    setIsClosingCase(true)
    try {
      const response = await api.put(`/api/v1/cases/${caseId}/close`, {}, { auth: true })
      if (response?.success) {
        toast.success('Case closed successfully')
        // Refresh case data
        const updatedResponse = await api.get(`/api/v1/cases/${caseId}`)
        if (updatedResponse?.data) {
          setReport(updatedResponse.data)
        }
        setIsCloseCaseModalOpen(false)
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to close case')
    } finally {
      setIsClosingCase(false)
    }
  }

  const handleReopenCase = async () => {
    if (!caseId) return

    setIsReopeningCase(true)
    try {
      const response = await api.put(`/api/v1/cases/${caseId}/reopen`, {}, { auth: true })
      if (response?.success) {
        toast.success('Case reopened successfully')
        // Refresh case data
        const updatedResponse = await api.get(`/api/v1/cases/${caseId}`)
        if (updatedResponse?.data) {
          setReport(updatedResponse.data)
        }
        setIsReopenCaseModalOpen(false)
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to reopen case')
    } finally {
      setIsReopeningCase(false)
    }
  }

  const handleConcludeCase = async () => {
    if (!caseId) return

    setIsConcludingCase(true)
    try {
      const response = await api.put(`/api/v1/cases/${caseId}/conclude`, { concludeNote }, { auth: true })
      if (response?.success) {
        toast.success('Case concluded successfully')
        const updatedResponse = await api.get(`/api/v1/cases/${caseId}`)
        if (updatedResponse?.data) {
          setReport(updatedResponse.data)
        }
        setConcludeNote('')
        setIsConcludeModalOpen(false)
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to conclude case')
    } finally {
      setIsConcludingCase(false)
    }
  }

  const handleOpenChat = () => {
    navigate('/reports/chat', {
      state: {
        from: `${location.pathname}${location.search}${location.hash}`,
        report,
        recipient: reportData.reporterEmail || reportData.reportedBy,
      },
    })
  }

  const formatCommentAuthor = (comment) => {
    const email = displayValue(comment?.commenterEmail)
    const unit = resolveUnitName(comment?.commenterUnit)

    if (unit === 'Not available') {
      return email
    }

    return `${email} (${unit})`
  }

  const trackingSteps = [
    { label: 'Reported', active: true },
    { label: resolveUnitName(reportData.currentUnit), active: Boolean(reportData.currentUnit) },
    { label: resolveUnitName(reportData.nextUnit), active: false },
    { label: 'Closed', active: Boolean(reportData.closed) },
  ]

  return (
    <>
      <div className="report-details-container">
        <Searchbar />
        <Sidebar />
        <div className="report-details-page">

          {/* ── Header ── */}
          <div className="rd-header">
            <div className="rd-header-left">
              <button className="rd-back-btn" onClick={() => navigate(returnTo)}>
                <IoArrowBackOutline size={20} />
              </button>
              <span className="rd-title">Report Details</span>
            </div>
            <div className="rd-header-right">
              <button className="rd-btn-chat" onClick={handleOpenChat}>
                Chat Reported User
              </button>
              <button className="rd-btn-update" onClick={() => setIsUpdateModalOpen(true)}>
                Update <IoMdAdd size={18} />
              </button>
              {!reportData.closed && (
                <button 
                  className="rd-btn-close" 
                  onClick={() => setIsCloseCaseModalOpen(true)}
                  disabled={isClosingCase}
                >
                  Close Case
                </button>
              )}
              {reportData.closed && (
                <button 
                  className="rd-btn-reopen" 
                  onClick={() => setIsReopenCaseModalOpen(true)}
                  disabled={isReopeningCase}
                >
                  Reopen Case
                </button>
              )}
              <button
                className="rd-btn-conclude"
                onClick={() => setIsConcludeModalOpen(true)}
                disabled={isConcludingCase}
              >
                Conclude Case
              </button>
              <button className="rd-btn-icon" onClick={() => setIsDownloadPopupOpen(true)}>
                <MdOutlineFileDownload size={22} />
              </button>
              <button className="rd-btn-icon">
                <FaRegFolderOpen size={20} />
              </button>
            </div>
          </div>

          <div className="rd-summary-grid">
            <div className="rd-summary-item">
              <span>Case No.</span>
              <p>{displayValue(reportData.caseNumber)}</p>
            </div>
            <div className="rd-summary-item">
              <span>Incident Type</span>
              <p>{displayValue(reportData.incidentType)}</p>
            </div>
            <div className="rd-summary-item">
              <span>Reported Date</span>
              <p>{formatDateTime(reportData.createdAt)}</p>
            </div>
            <div className="rd-summary-item">
              <span>Reported By</span>
              <p>{displayValue(reportData.reportedBy)}</p>
            </div>
            <div className="rd-summary-item">
              <span>Closed</span>
              <p>{reportData.closed ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div className="rd-content-grid">
            <section className="rd-section-card rd-section-wide">
              <h3>Tracking</h3>
              <div className="rd-tracking">
                {trackingSteps.map((step, index) => (
                  <React.Fragment key={`${step.label}-${index}`}>
                    <div className={`rd-round ${step.active ? 'active' : ''}`} />
                    {index !== trackingSteps.length - 1 && (
                      <div className={`rd-line ${step.active ? 'active' : ''}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="rd-tracking-labels">
                {trackingSteps.map((step, index) => (
                  <p key={`${step.label}-label-${index}`}>{step.label}</p>
                ))}
              </div>
            </section>

            <section className="rd-section-card rd-section-wide">
              <h3>Incident Details</h3>
              <div className="rd-incident-layout">
                <div className="rd-info-grid">
                  <div className="rd-info-item">
                    <span>Date of Incident</span>
                    <p>{formatDateTime(reportData.dateOfIncident)}</p>
                  </div>
                  <div className="rd-info-item">
                    <span>Location</span>
                    <p>{displayValue(reportData.location)}</p>
                  </div>
                  <div className="rd-info-item">
                    <span>Status</span>
                    <p>{displayValue(reportData.status)}</p>
                  </div>
                  <div className="rd-info-item">
                    <span>Current Unit</span>
                    <p>{resolveUnitName(reportData.currentUnit)}</p>
                  </div>
                  <div className="rd-info-item">
                    <span>Next Unit</span>
                    <p>{resolveUnitName(reportData.nextUnit)}</p>
                  </div>
                  <div className="rd-info-item">
                    <span>Updated At</span>
                    <p>{formatDateTime(reportData.updatedAt)}</p>
                  </div>
                </div>

                <div className="rd-description-pane">
                  <span>Event Description</span>
                  <div className="rd-description-scroll">
                    {descriptionText}
                  </div>
                </div>
              </div>
            </section>

            <section className="rd-section-card">
              <h3>Files</h3>
              <div className="rd-thumbnail-grid">
                {filesToRender.map((file, index) => (
                  <button
                    type="button"
                    className={`rd-thumbnail-item ${isImageFile(file) ? 'is-image' : 'is-file'}`}
                    key={file.id || `${getFileUrl(file)}-${index}`}
                    onClick={() => handleFilePreview(file, index)}
                    disabled={!isImageFile(file)}
                    aria-label={`Preview ${getFileName(file, index)}`}
                  >
                    {isImageFile(file) ? (
                      <>
                        <img src={getFileUrl(file)} alt={getFileName(file, index)} className="rd-thumbnail-image" />
                        <span className="rd-thumbnail-label">{getFileName(file, index)}</span>
                      </>
                    ) : (
                      <span className="rd-file-item">{getFileName(file, index)}</span>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <section className="rd-section-card rd-section-wide">
              <h3>Comments ({commentsToRender.length})</h3>
              <div className="rd-comments">
                {commentsToRender.map((comment, index) => (
                  <div className="rd-comment-card" key={comment.id || `${comment.commenterEmail}-${index}`}>
                    <p className="rd-comment-meta">
                      {formatCommentAuthor(comment)}
                      <span>{formatDateTime(comment.createdAt)}</span>
                    </p>
                    <p className="rd-comment-text">{displayValue(comment.comment)}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>

      {/* ── Download modal ── */}
      {isDownloadPopupOpen && (
        <div className="rd-modal-overlay">
          <div className="rd-modal">
            <div className="rd-modal-close">
              <IoMdClose size={28} onClick={() => setIsDownloadPopupOpen(false)} />
            </div>
            <img src={warning} alt="warning" />
            <p className="rd-modal-title">Download Report</p>
            <p className="rd-modal-body">This report would be downloaded in pdf format, hence you will have access to it offline. Please note that this report should only be used for official purposes.</p>
            <div className="rd-modal-actions">
              <button className="rd-modal-cancel" onClick={() => setIsDownloadPopupOpen(false)}>Cancel</button>
              <button className="rd-modal-confirm">Start Download</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Update modal ── */}
      {isUpdateModalOpen && (
        <div className="rd-modal-overlay">
          <div className="rd-update-modal">
            <div className="rd-update-header" onClick={() => setIsUpdateModalOpen(false)}>
              <IoArrowBackOutline size={22} />
              <p>Update Report</p>
            </div>
            <form className="rd-update-form" onSubmit={handleUpdateFormSubmit}>
              <label htmlFor="nextUnit">Next Unit</label>
              <select
                id="nextUnit"
                name="nextUnitId"
                value={updateFormData.nextUnitId}
                onChange={handleUpdateFormChange}
                required
                disabled={isLoadingUnits || isSubmittingUpdate}
              >
                <option value="">{isLoadingUnits ? 'Loading units...' : 'Select a unit'}</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>

              <label htmlFor="comment">Comment on Case</label>
              <textarea
                id="comment"
                name="comment"
                value={updateFormData.comment}
                onChange={handleUpdateFormChange}
                placeholder="Add your comments here..."
                rows={6}
                disabled={isSubmittingUpdate}
                required
              />

              <div className="rd-update-actions">
                <button
                  type="button"
                  className="rd-update-cancel"
                  onClick={() => setIsUpdateModalOpen(false)}
                  disabled={isSubmittingUpdate}
                >
                  Cancel
                </button>
                <button type="submit" className="rd-update-submit">
                  {isSubmittingUpdate ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Close Case modal ── */}
      {isCloseCaseModalOpen && (
        <div className="rd-modal-overlay">
          <div className="rd-modal">
            <div className="rd-modal-close">
              <IoMdClose size={28} onClick={() => setIsCloseCaseModalOpen(false)} />
            </div>
            <img src={warning} alt="warning" />
            <p className="rd-modal-title">Close Case</p>
            <p className="rd-modal-body">Are you sure you want to close this case? This action will mark the case as closed and cannot be easily reversed.</p>
            <div className="rd-modal-actions">
              <button 
                className="rd-modal-cancel" 
                onClick={() => setIsCloseCaseModalOpen(false)}
                disabled={isClosingCase}
              >
                Cancel
              </button>
              <button 
                className="rd-modal-confirm" 
                onClick={handleCloseCase}
                disabled={isClosingCase}
              >
                {isClosingCase ? 'Closing...' : 'Close Case'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reopen Case modal ── */}
      {isReopenCaseModalOpen && (
        <div className="rd-modal-overlay">
          <div className="rd-modal">
            <div className="rd-modal-close">
              <IoMdClose size={28} onClick={() => setIsReopenCaseModalOpen(false)} />
            </div>
            <img src={warning} alt="warning" />
            <p className="rd-modal-title">Reopen Case</p>
            <p className="rd-modal-body">Are you sure you want to reopen this case? This will allow further actions and updates to be made on the case.</p>
            <div className="rd-modal-actions">
              <button 
                className="rd-modal-cancel" 
                onClick={() => setIsReopenCaseModalOpen(false)}
                disabled={isReopeningCase}
              >
                Cancel
              </button>
              <button 
                className="rd-modal-confirm" 
                onClick={handleReopenCase}
                disabled={isReopeningCase}
              >
                {isReopeningCase ? 'Reopening...' : 'Reopen Case'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Conclude Case modal ── */}
      {isConcludeModalOpen && (
        <div className="rd-modal-overlay">
          <div className="rd-update-modal">
            <div className="rd-update-header" onClick={() => { if (!isConcludingCase) { setConcludeNote(''); setIsConcludeModalOpen(false) } }}>
              <IoArrowBackOutline size={22} />
              <p>Conclude Case</p>
            </div>
            <p className="rd-modal-body" style={{ margin: '0 0 4px', textAlign: 'left' }}>
              Provide a concluding note for this case. This will mark the case as concluded.
            </p>
            <div className="rd-update-form">
              <label htmlFor="concludeNote">Conclude Note</label>
              <textarea
                id="concludeNote"
                name="concludeNote"
                value={concludeNote}
                onChange={(e) => setConcludeNote(e.target.value)}
                placeholder="Enter your concluding remarks..."
                rows={6}
                disabled={isConcludingCase}
                required
              />
              <div className="rd-update-actions">
                <button
                  type="button"
                  className="rd-update-cancel"
                  onClick={() => { setConcludeNote(''); setIsConcludeModalOpen(false) }}
                  disabled={isConcludingCase}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rd-update-submit"
                  onClick={handleConcludeCase}
                  disabled={isConcludingCase || !concludeNote.trim()}
                >
                  {isConcludingCase ? 'Concluding...' : 'Conclude Case'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeImagePreview && (
        <div className="rd-image-preview-overlay" onClick={() => setActiveImagePreview(null)}>
          <div className="rd-image-preview-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="rd-image-preview-close"
              onClick={() => setActiveImagePreview(null)}
              aria-label="Close image preview"
            >
              <IoMdClose size={24} />
            </button>
            <img src={activeImagePreview.src} alt={activeImagePreview.alt} className="rd-image-preview-full" />
          </div>
        </div>
      )}
    </>
  )
}

export default ReportDetails
