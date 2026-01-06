import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import '../css/Reports.css'

import warning from '../assets/warningOrangeBg.png'
import audio from '../assets/media1.png'
import img1 from '../assets/media2.png'
import video from '../assets/media3.png'
import img2 from '../assets/media4.png'
import img3 from '../assets/media5.png'

import { HiDotsHorizontal, HiDotsVertical } from "react-icons/hi";
import { RxDashboard } from "react-icons/rx";
import { FaLongArrowAltDown, FaLongArrowAltUp  } from "react-icons/fa";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import { GrDocumentPdf } from "react-icons/gr";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaRegFolderOpen } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";


const Reports = () => {
const[isFilterOpen, setIsFilterOpen]= useState(false)
const[isSortOpen, setIsSortOpen]= useState(false)
const[isPdfOpen, setIsPdfOpen] = useState(false)
const[selectedReport, setSelectedReport] = useState(null);
const[isReportDetailsOpen, SetisReportDetailsOpen] = useState(false)
const[isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false)
const[isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)


function handleOpenDownloadModal(){
  setIsDownloadPopupOpen(prev => !prev)
}

function handleCloseDownloadModal(){
  setIsDownloadPopupOpen(false)
}
function handleFilterOpen(){
  setIsFilterOpen(prev => !prev)
}

function handleFilterClose(){
  setIsFilterOpen(false)
}

function handleSortOpen(){
  setIsSortOpen(prev => !prev)
}

function handleSortClose(){
  setIsSortOpen(false)
}

function handlePdfOpen(){
  setIsPdfOpen(prev => !prev)
}

// function handlePdfClose(){
//   setIsPdfOpen(false)
// }

function handleOpenReportDetails(report){
  setSelectedReport(report);
  SetisReportDetailsOpen(true)
}

const tableHead = ["CaseNo","Type", "Status", "Tracking", "Date", ""];
const tableContent=[
    {id:"A1208", type:"Sexual Harrassment",status:"Pending",},
    {id:"A2051",type:"Gender-based Violence",status:"Pending",},
    {id:"A2351",type:"Rape Issues",status:"Pending",},
    {id:"A2051",type:"Gender-based Violence",status:"Pending",},
    {id:"A2051",type:"Gender-based Violence",status:"Pending",},
    {id:"A2051",type:"Gender-based Violence",status:"Pending",},
]
// const pdfList=[
  //   {
  //     caseNo:"A1208",
  //     type:"Sexual Harrassment",
  //     status:"Pending",
  //     width:"30%"
  //   },
  //   {
  //     caseNo:"A2051",
  //     type:"Gender-based Violence",
  //     status:"In Progress",
  //     width:"50%"
  //   },
  //   {
  //     caseNo:"A2351",
  //     type:"Rape Issues",
  //     status:"Resolved",
  //   },
  //   {
  //     caseNo:"A2051",
  //     type:"Gender-based Violence",
  //     status:"Pending",
  //     width:"30%"
  //   },
  //   {
  //     caseNo:"A2051",
  //     type:"Gender-based Violence",
  //     status:"Pending",
  //     width:"30%"
  //   },
  //   {
  //     caseNo:"A2051",
  //     type:"Gender-based Violence",
  //     status:"Closed",
  //   },
// ]
return (
    <>
<div className='reports-container'>
  <Searchbar />
  <Sidebar />
  <div className='reports'>
    <div className='reports-head'>
      <p>Reports</p>
      <div className='head-right'>
        <button onClick={handleSortOpen}><FaLongArrowAltUp size={24}/><FaLongArrowAltDown size={24}/></button>
        <button onClick={handlePdfOpen}>{!isPdfOpen && <RxDashboard size={24}/>}{isPdfOpen && <RxHamburgerMenu size={24}/>}</button>
        <button onClick={handleFilterOpen}><HiOutlineAdjustmentsVertical size={24}/>Filter</button>
      </div>
    </div>

  {!isPdfOpen && !isReportDetailsOpen &&
    <div className='reports-body'>
      <table>
        <thead>
         <tr>
          {tableHead.map((value, index) => (
          <th key={index}>{value}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableContent.map((value, index)=> (
              <ReportList
                key={index}
                id={value.id}
                type={value.type}
                status={value.status}
                color={value.color}
                bgcolor={value.bgcolor}
                width={value.width}
                onOpenDetails={() => handleOpenReportDetails(value)}
            />
            ))}
          </tbody>
        </table>
      </div>}


{isFilterOpen && 
  <div className='modal-overlay'>
    <div className='filter-card'> 
      <div onClick={handleFilterClose} className='close-icon'><IoMdClose size={30}/></div>
      <p>Apply filter(s):</p>
      <div className='options'>
        <Filtercard text="Gender-based Violence"/>
        <Filtercard text="Rape Issues"/>
        <Filtercard text="Sexual Harrasment"/>
        <Filtercard text="Pending"/>
        <Filtercard text="Resolved"/>
        <Filtercard text="Cancelled"/>
        <Filtercard text="Yesterday"/>
        <Filtercard text="Last 1 week"/>
        <Filtercard text="Last 1 month"/>
      </div>
        <button onClick={handleFilterClose}>Done</button>
    </div> 
</div>}

{isSortOpen &&
  <div className='modal-overlay'>
  <div className='sort-card'>
    <div onClick={handleSortClose} className='close-icon'><IoMdClose size={30}/></div>
    <p>Sort by:</p>
    <div className='options'>
      <SortCard text="Date (Ascending)" id="ascending"/>
      <SortCard text="Date (Descending)" id="descending"/>
      <SortCard text="Status" id="status"/>
      <SortCard text="Type" id="type"/>
      <button onClick={handleSortClose}>Apply</button>
    </div>
</div>
</div>}

{isPdfOpen && !isReportDetailsOpen &&
    <div className='pdf-files'>
      {tableContent.map((value, index) =>
      <Pdf 
      key={index}
      caseNo={value.id}
      type={value.type}
      width={value.width}
      status={value.status}
      onOpenDetails={() => handleOpenReportDetails(value)}
      />
      )}
    </div>}

  {isReportDetailsOpen && selectedReport &&
  <div className='report-details'>
      <div className='details-header'>
        <div className='details-header-left'>
        <button onClick={() => SetisReportDetailsOpen(false)}><IoArrowBackOutline size={24}/></button>
        <p>Report Details</p>
        </div>
        <div className='details-header-right'>
        <button onClick={() => setIsUpdateModalOpen(prev => !prev)}>Update <IoMdAdd size={24}/></button>
        <button onClick={handleOpenDownloadModal}><MdOutlineFileDownload size={24}/></button>
        <button><FaRegFolderOpen size={24} /></button>
        </div>
      </div>
      <div className='report-content'>
        <p>Case No.
          <span>{selectedReport.id}</span>
        </p>
        <p>Incident type
          <span>{selectedReport.type}</span>
        </p>
        <p>Date of Occurence
          <span>20th June, 2025</span>
        </p>
        <p>Location
          <span>Faculty of Science, Unilag</span>
        </p>
        <p>Description
          <span>Lorem ipsum dolor sit amet consectetur. Eu nullam sapien quisque quis lorem nulla posuere et. Gravida pharetra vulputate non dictumst euismod. Nulla blandit id diam ut elementum in risus risus. Hac quam nunc nisl sollicitudin tempus. Nulla malesuada pellentesque neque nunc nisl senectus tellus sed. Mauris rhoncus gravida adipiscing risus congue. Ipsum diam platea diam lectus pretium in eu eu non duis. Lorem ipsum dolor sit amet consectetur. Eu nullam sapien quisque quis lorem nulla posuere et.</span>
        </p>
        <p>Media
          <div className='media'>
          <img src={img1} />
          <img src={img2} />
          <img src={audio} />
          <img src={audio} />
          <img src={video} />
          <img src={img3} />
          <img src={audio} />
          <img src={img2} />
          <img src={img3} />
          </div>
        </p>
        <p>Status
          <span>{selectedReport.status}</span>
        </p>
        <p>Tracking
          <div className='tracking'>
            <div className='round active'></div>
            <div className='progress active'></div>
            <div className='round'></div>
            <div className='progress'></div>
            <div className='round'></div>
            <div className='progress'></div>
            <div className='round'></div>
            <div className='progress'></div>
            <div className='round'></div>
            <div className='progress'></div>
            <div className='round'></div>
            <div className='progress'></div>
            <div className='round'></div>
            <div className='progress'></div>
            <div className='round'></div>
          </div>
        </p>
      </div>
  {isDownloadPopupOpen &&
    <div className='modal-overlay'>
        <div className='delete-popup'>
        <div className='close-icon'><IoMdClose size={30} onClick={handleCloseDownloadModal}/></div>
        <img src={warning} />
        <p>Download Report</p>
        <p>This report would be downloaded in pdf format, hence you will have access to it offline. Please note that this report should only be used for official purposes.</p>
        <div className='buttons'>
        <button type='submit' onClick={handleCloseDownloadModal}>Cancel</button>
        <button type='submit'>Start Download</button>
        </div>
        </div>
    </div>}
  
  {isUpdateModalOpen && 
    <div className='modal-overlay'>
        <div className='update-report'>
        <div className='close-icon' onClick={() => setIsUpdateModalOpen(false)}><IoArrowBackOutline size={24}/>
        <p>Update Report</p>
        </div>
        <label>Tracking</label>
        <select>
          <option>Reporting of case</option>
          <option>Questioning of victims</option>
          <option>Referring of victims for selfcare/checkup</option>
          <option>Submission of case reports to the VC’s office </option>
          <option>Investigation/interrogation of victims, suspects and witnesses</option>
          <option>Submission of findings and recommendations to the VC’s office</option>
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
  }
  </div>}
</div>
    </div>  
  </>
  )
}

function ReportList({ id, type, status, onOpenDetails }) {
const[isDetailsOpen, setIsDetailsOpen]= useState(false)
const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false)
const [isArchivePopupOpen, setIsArchivePopupOpen] = useState(false)
  
  
  function handleOpenDetails(){
    setIsDetailsOpen(prev => !prev)
}

// function handleCloseDetails(){
//   setIsDetailsOpen(false)
// }

function handleOpenDownloadModal(){
  setIsDownloadPopupOpen(prev => !prev)
  setIsDetailsOpen(false)
  
}

function handleCloseDownloadModal(){
  setIsDownloadPopupOpen(false)
}

function handleStartDownload(){
}

function handleOpenArchiveModal(){
  setIsArchivePopupOpen(prev => !prev)
  setIsDetailsOpen(false)
}

function handleCloseArchiveModal(){
  setIsArchivePopupOpen(false)
}

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2); // 25 for 2025
  return `${day}-${month}-${year}`;
}

  let background;
  let color;
  let width;

  if(status === "Resolved"){
    background = "#48C9B01A";
    color = "#48C9B0";
  } else if (status === "Pending"){
    background = "#EAC4001A";
    color = "#EAC400";
  } else if (status === "In Progress"){
    background = "#3DACF51A";
    color = "#3DACF5";
  } else if (status === "Closed"){
    background = "#9999991A";
    color = "#999999";
  } 
  return (
    <>
    <tr>
      <td>{id}</td>
      <td>{type}</td>
      <td 
        style={{ color, background }} 
        className='status'
      >
        {status}
      </td>
      <td>
        <div className='progress-bar'>
          <div 
            className='progress' 
            style={{ width: width}}
          ></div>
        </div>
      </td>
      <td>{formatDate(new Date())}</td>
      <td><button className='icon' onClick={handleOpenDetails}><HiDotsHorizontal /></button></td>
    </tr>

    {isDetailsOpen &&
    <div className='submenu-dropdown'>
      <div className='options'>
      <button onClick={onOpenDetails}>Details</button>
      <button onClick={handleOpenDownloadModal}>Download pdf</button>
      <button>Share</button>
      <button onClick={handleOpenArchiveModal}>Archive</button> 
    </div>
  </div>}

{isDownloadPopupOpen &&
    <div className='modal-overlay'>
        <div className='delete-popup'>
        <div className='close-icon'><IoMdClose size={30} onClick={handleCloseDownloadModal}/></div>
        <img src={warning} />
        <p>Download Report</p>
        <p>This report would be downloaded in pdf format, hence you will have access to it offline. Please note that this report should only be used for official purposes.</p>
        <div className='buttons'>
        <button type='submit' onClick={handleCloseDownloadModal}>Cancel</button>
        <button type='submit' onClick={handleStartDownload}>Start Download</button>
        </div>
        </div>
    </div>}
    
{isArchivePopupOpen &&
    <div className='modal-overlay'>
        <div className='delete-popup'>
        <div className='close-icon'><IoMdClose size={30} onClick={handleCloseArchiveModal}/></div>
        <img src={warning} />
        <p>Archive Report</p>
        <p>You are about to archive this report. You can find all archived reports in your profile. </p>
        <div className='buttons'>
        <button type='submit' onClick={handleCloseArchiveModal}>Cancel</button>
        <button type='submit' onClick={handleStartDownload}>Archive</button>
        </div>
        </div>
    </div>}
</>  );
}

function Filtercard({text}){
  return(
    <>
    <div className='option'>
    <input type="checkbox"/>
    <label>{text}</label>
    </div>
    </>
  )
}

function SortCard({text, id}){
  return(
    <div className='option'>
    <input type='radio'id={id} name="sortOrder"/>
    <label htmlFor={id}>{text}</label>
    </div> 
  )
}

function Pdf({caseNo, type, status, width, onOpenDetails}){
  let background;
  let color;

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2); // 25 for 2025
  return `${day}-${month}-${year}`;
}

  if(status === "Resolved"){
    background = "#48C9B01A";
    color = "#48C9B0";
  } else if (status === "Pending"){
    background = "#EAC4001A";
    color = "#EAC400";
  } else if (status === "In Progress"){
    background = "#3DACF51A";
    color = "#3DACF5";
  } else if (status === "Closed"){
    background = "#9999991A";
    color = "#999999";
  }

  const[isDetailsOpen, setIsDetailsOpen]= useState(false)
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false)
    const [isArchivePopupOpen, setIsArchivePopupOpen] = useState(false)
  
  
  function handleOpenDetails(){
    setIsDetailsOpen(prev => !prev)
}

// function handleCloseDetails(){
//   setIsDetailsOpen(false)
// }

function handleOpenDownloadModal(){
  setIsDownloadPopupOpen(prev => !prev)
  setIsDetailsOpen(false)
}

function handleCloseDownloadModal(){
  setIsDownloadPopupOpen(false)
}

function handleStartDownload(){

}

function handleOpenArchiveModal(){
  setIsArchivePopupOpen(prev => !prev)
  setIsDetailsOpen(false)
}

function handleCloseArchiveModal(){
  setIsArchivePopupOpen(false)
}
  return(
    <>
      <div className='pdf-file'> 
        <div className='file-top'>
          <GrDocumentPdf size={35}/>
          <HiDotsVertical size={25} className='icon' onClick={handleOpenDetails}/>
        </div>
        <div className='file-middle'>
          <p>Case No. {caseNo}</p>
          <p>{type}
            <span>{formatDate(new Date())}</span>
          </p>
        </div>
        <div className='file-bottom'>
          <p style={{background, color}}>{status}</p>
        <div className='progress-bar'>
          <div className='progress' style={{width:width,}}></div>
        </div>
        </div>
  {isDetailsOpen &&
    <div className='submenu-dropdown'>
      <div className='options'>
      <button onClick={onOpenDetails}>Details</button>
      <button onClick={handleOpenDownloadModal}>Download pdf</button>
      <button>Share</button>
      <button onClick={handleOpenArchiveModal}>Archive</button> 
    </div>
  </div>}

{isDownloadPopupOpen &&
    <div className='modal-overlay'>
        <div className='delete-popup'>
        <div className='close-icon'><IoMdClose size={30} onClick={handleCloseDownloadModal}/></div>
        <img src={warning} />
        <p>Download Report</p>
        <p>This report would be downloaded in pdf format, hence you will have access to it offline. Please note that this report should only be used for official purposes.</p>
        <div className='buttons'>
        <button type='submit' onClick={handleCloseDownloadModal}>Cancel</button>
        <button type='submit' onClick={handleStartDownload}>Start Download</button>
        </div>
        </div>
    </div>}
    
{isArchivePopupOpen &&
    <div className='modal-overlay'>
        <div className='delete-popup'>
        <div className='close-icon'><IoMdClose size={30} onClick={handleCloseArchiveModal}/></div>
        <img src={warning} />
        <p>Archive Report</p>
        <p>You are about to archive this report. You can find all archived reports in your profile. </p>
        <div className='buttons'>
        <button type='submit' onClick={handleCloseArchiveModal}>Cancel</button>
        <button type='submit' onClick={handleStartDownload}>Archive</button>
        </div>
        </div>
    </div>}
      </div>
  </>
  )
}
export default Reports 