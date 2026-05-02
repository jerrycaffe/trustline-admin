import React, { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import '../css/ReportDetails.css'

import warning from '../assets/warningOrangeBg.png'

import { IoArrowBackOutline } from 'react-icons/io5'
import { IoMdAdd, IoMdClose } from 'react-icons/io'
import { MdOutlineFileDownload } from 'react-icons/md'
import { FaRegFolderOpen } from 'react-icons/fa'

const ReportDetails = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location
  const report = state?.report
  const returnTo = state?.from || '/reports'

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false)
  const [activeImagePreview, setActiveImagePreview] = useState(null)
  const [updateFormData, setUpdateFormData] = useState({
    nextUnit: '',
    comment: '',
  })

  if (!report) {
    return <Navigate to="/reports" replace />
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

  const reportData = {
    id: report.id,
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

  const previewFiles = [
    { id: 'sample-file-1', name: 'Scene photo 1', url: warning, type: 'image/png' },
    { id: 'sample-file-2', name: 'Scene photo 2', url: warning, type: 'image/png' },
    { id: 'sample-file-3', name: 'Scene photo 3', url: warning, type: 'image/png' },
  ]

  const previewComments = [
    {
      id: 'sample-comment-1',
      comment: 'Initial report received. The case has been acknowledged and assigned for first review.',
      commenterEmail: 'intake.team@trustline.org',
      createdAt: '2026-05-01T17:10:22.647Z',
    },
    {
      id: 'sample-comment-2',
      comment: 'Evidence attachments have been validated. Escalating to the next unit for assessment.',
      commenterEmail: 'review.unit@trustline.org',
      createdAt: '2026-05-02T09:14:22.647Z',
    },
    {
      id: 'sample-comment-3',
      comment: 'Waiting for final feedback from the current unit before closure recommendation.',
      commenterEmail: 'case.manager@trustline.org',
      createdAt: '2026-05-03T13:44:22.647Z',
    },
  ]

  const filesToRender = reportData.files.length > 0 ? reportData.files : previewFiles
  const commentsToRender = reportData.comments.length > 0 ? reportData.comments : previewComments
  const isFilesPreview = reportData.files.length === 0
  const isCommentsPreview = reportData.comments.length === 0

  const descriptionText = reportData.description || 'A report was submitted regarding repeated incidents in a specific location. The matter requires review by the current unit and handoff to the next unit for follow-up actions. Supporting files and timeline comments should be reviewed together to establish context and decision path.'

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
    // Handle form submission to backend
    console.log('Update form submitted:', updateFormData)
    // Reset form and close modal
    setUpdateFormData({ nextUnit: '', comment: '' })
    setIsUpdateModalOpen(false)
  }

  const adminMessageTemplates = [
    'Hello, thank you for your report. Please share more context about the incident timeline.',
    'Could you confirm the exact location and approximate time of this incident?',
    'Please provide any additional evidence or attachments that support this case.',
    'Can you share names or descriptions of anyone involved or present at the scene?',
    'Has this happened before? If yes, please provide previous dates or references.',
    'For your safety, do you currently need urgent support or immediate intervention?',
  ]

  const handleOpenChat = () => {
    navigate('/reports/chat', {
      state: {
        from: `${location.pathname}${location.search}${location.hash}`,
        report,
        recipient: reportData.reporterEmail || reportData.reportedBy,
        templates: adminMessageTemplates,
      },
    })
  }

  const trackingSteps = [
    { label: 'Reported', active: true },
    { label: displayValue(reportData.currentUnit), active: Boolean(reportData.currentUnit) },
    { label: displayValue(reportData.nextUnit), active: false },
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
              <p>{displayValue(reportData.id)}</p>
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
                    <p>{displayValue(reportData.currentUnit)}</p>
                  </div>
                  <div className="rd-info-item">
                    <span>Next Unit</span>
                    <p>{displayValue(reportData.nextUnit)}</p>
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
              {isFilesPreview && <p className="rd-preview-note">Showing sample files preview</p>}
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
              {isCommentsPreview && <p className="rd-preview-note">Showing sample comments preview</p>}
              <div className="rd-comments">
                {commentsToRender.map((comment, index) => (
                  <div className="rd-comment-card" key={comment.id || `${comment.commenterEmail}-${index}`}>
                    <p className="rd-comment-meta">
                      {displayValue(comment.commenterEmail)}
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
                name="nextUnit"
                value={updateFormData.nextUnit}
                onChange={handleUpdateFormChange}
                required
              >
                <option value="">Select a unit</option>
                <option value="Investigation Unit">Investigation Unit</option>
                <option value="Case Management">Case Management</option>
                <option value="Support Services">Support Services</option>
                <option value="Follow-up Unit">Follow-up Unit</option>
              </select>

              <label htmlFor="comment">Comment on Case</label>
              <textarea
                id="comment"
                name="comment"
                value={updateFormData.comment}
                onChange={handleUpdateFormChange}
                placeholder="Add your comments here..."
                rows={6}
              />

              <div className="rd-update-actions">
                <button
                  type="button"
                  className="rd-update-cancel"
                  onClick={() => setIsUpdateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="rd-update-submit">
                  Update
                </button>
              </div>
            </form>
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
