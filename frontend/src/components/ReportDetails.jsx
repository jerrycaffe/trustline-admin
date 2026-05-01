import React, { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import '../css/ReportDetails.css'

import warning from '../assets/warningOrangeBg.png'
import audio from '../assets/media1.png'
import img1 from '../assets/media2.png'
import video from '../assets/media3.png'
import img2 from '../assets/media4.png'
import img3 from '../assets/media5.png'

import { IoArrowBackOutline } from 'react-icons/io5'
import { IoMdAdd, IoMdClose } from 'react-icons/io'
import { MdOutlineFileDownload } from 'react-icons/md'
import { FaRegFolderOpen } from 'react-icons/fa'

const ReportDetails = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const report = state?.report

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false)

  if (!report) {
    return <Navigate to="/reports" replace />
  }

  return (
    <>
      <div className="report-details-container">
        <Searchbar />
        <Sidebar />
        <div className="report-details-page">

          {/* ── Header ── */}
          <div className="rd-header">
            <div className="rd-header-left">
              <button className="rd-back-btn" onClick={() => navigate('/reports')}>
                <IoArrowBackOutline size={20} />
              </button>
              <span className="rd-title">Report Details</span>
            </div>
            <div className="rd-header-right">
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

          {/* ── Content card ── */}
          <div className="rd-content">
            <div className="rd-row">
              <span className="rd-label">Case No.</span>
              <span className="rd-value">{report.id}</span>
            </div>
            <div className="rd-row">
              <span className="rd-label">Incident type</span>
              <span className="rd-value">{report.type}</span>
            </div>
            <div className="rd-row">
              <span className="rd-label">Date of Occurrence</span>
              <span className="rd-value">20th June, 2025</span>
            </div>
            <div className="rd-row">
              <span className="rd-label">Location</span>
              <span className="rd-value">Faculty of Science, Unilag</span>
            </div>
            <div className="rd-row">
              <span className="rd-label">Description</span>
              <span className="rd-value">Lorem ipsum dolor sit amet consectetur. Eu nullam sapien quisque quis lorem nulla posuere et. Gravida pharetra vulputate non dictumst euismod. Nulla blandit id diam ut elementum in risus risus. Hac quam nunc nisl sollicitudin tempus. Nulla malesuada pellentesque neque nunc nisl senectus tellus sed. Mauris rhoncus gravida adipiscing risus congue.</span>
            </div>
            <div className="rd-row">
              <span className="rd-label">Media</span>
              <div className="rd-media">
                <img src={img1} alt="media" />
                <img src={img2} alt="media" />
                <img src={audio} alt="media" />
                <img src={audio} alt="media" />
                <img src={video} alt="media" />
                <img src={img3} alt="media" />
                <img src={audio} alt="media" />
                <img src={img2} alt="media" />
                <img src={img3} alt="media" />
              </div>
            </div>
            <div className="rd-row">
              <span className="rd-label">Status</span>
              <span className="rd-value">{report.status}</span>
            </div>
            <div className="rd-row">
              <span className="rd-label">Tracking</span>
              <div className="rd-tracking">
                <div className="rd-round active"></div>
                <div className="rd-line active"></div>
                <div className="rd-round"></div>
                <div className="rd-line"></div>
                <div className="rd-round"></div>
                <div className="rd-line"></div>
                <div className="rd-round"></div>
                <div className="rd-line"></div>
                <div className="rd-round"></div>
                <div className="rd-line"></div>
                <div className="rd-round"></div>
                <div className="rd-line"></div>
                <div className="rd-round"></div>
                <div className="rd-line"></div>
                <div className="rd-round"></div>
              </div>
            </div>
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
            <label>Tracking</label>
            <select>
              <option>Reporting of case</option>
              <option>Questioning of victims</option>
              <option>Referring of victims for selfcare/checkup</option>
              <option>Submission of case reports to the VC's office</option>
              <option>Investigation/interrogation of victims, suspects and witnesses</option>
              <option>Submission of findings and recommendations to the VC's office</option>
              <option>Penalties/Disciplinary Actions</option>
              <option>Case closed/Submission of final case report to the VC</option>
            </select>
            <label>Status</label>
            <select>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
            <button>Update</button>
          </div>
        </div>
      )}
    </>
  )
}

export default ReportDetails
