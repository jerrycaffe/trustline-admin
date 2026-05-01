import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import '../css/Reports.css'

import warning from '../assets/warningOrangeBg.png'

import { HiDotsHorizontal, HiDotsVertical } from "react-icons/hi";
import { RxDashboard } from "react-icons/rx";
import { FaLongArrowAltDown, FaLongArrowAltUp  } from "react-icons/fa";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { GrDocumentPdf } from "react-icons/gr";
import { RxHamburgerMenu } from "react-icons/rx";


const Reports = () => {
const navigate = useNavigate()
const[isFilterOpen, setIsFilterOpen]= useState(false)
const[isSortOpen, setIsSortOpen]= useState(false)
const[isPdfOpen, setIsPdfOpen] = useState(false)

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

function handleOpenReportDetails(report){
  navigate('/reports/details', { state: { report } })
}

const tableHead = ["Case No.", "Type", "Status", "Tracking", "Date", ""];
const tableContent = [
    { id: "A1208", type: "Sexual Harassment",    status: "Pending",     date: "02-07-24", width: "10%"  },
    { id: "A2051", type: "Gender-based violence", status: "Pending",    date: "22-06-24", width: "5%"   },
    { id: "A1208", type: "Sexual Harassment",    status: "In Progress", date: "02-07-24", width: "35%"  },
    { id: "A2351", type: "Rape Issues",          status: "Resolved",    date: "12-06-24", width: "80%"  },
    { id: "A1208", type: "Sexual Harassment",    status: "Pending",     date: "02-07-24", width: "5%"   },
    { id: "A2351", type: "Rape Issues",          status: "Resolved",    date: "12-06-24", width: "80%"  },
    { id: "A1208", type: "Sexual Harassment",    status: "Pending",     date: "02-07-24", width: "5%"   },
    { id: "A1208", type: "Sexual Harassment",    status: "In Progress", date: "02-07-24", width: "35%"  },
    { id: "A2351", type: "Rape Issues",          status: "Closed",      date: "12-06-24", width: "100%" },
    { id: "A2051", type: "Gender-based violence", status: "Pending",    date: "22-06-24", width: "5%"   },
    { id: "A2051", type: "Gender-based violence", status: "In Progress",date: "22-06-24", width: "35%"  },
    { id: "A1208", type: "Sexual Harassment",    status: "Closed",      date: "02-07-24", width: "100%" },
];
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

  {!isPdfOpen &&
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
              {tableContent.map((value, index)=> (
                <ReportList
                  key={index}
                  id={value.id}
                  type={value.type}
                  status={value.status}
                  date={value.date}
                  width={value.width}
                  onOpenDetails={() => handleOpenReportDetails(value)}
              />
              ))}
            </tbody>
          </table>
      </div>
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

{isPdfOpen &&
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

</div>
    </div>  
  </>
  )
}

function ReportList({ id, type, status, date, width, onOpenDetails }) {
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

  let background;
  let color;

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
    <tr onClick={onOpenDetails}>
      <td>{id}</td>
      <td>{type}</td>
      <td>
        <span
          style={{ color, background }}
          className='status'
        >
          {status}
        </span>
      </td>
      <td>
        <div className='progress-bar'>
          <div
            className='progress'
            style={{ width: width }}
          ></div>
        </div>
      </td>
      <td>{date}</td>
      <td><button className='icon' onClick={(event) => { event.stopPropagation(); handleOpenDetails(); }}><HiDotsHorizontal /></button></td>
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