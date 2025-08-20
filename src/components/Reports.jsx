import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import '../css/Reports.css'

import { HiDotsHorizontal } from "react-icons/hi";
import { RxDashboard } from "react-icons/rx";
import { FaLongArrowAltDown, FaLongArrowAltUp  } from "react-icons/fa";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";

const Reports = () => {
  const[isFilterOpen, setIsFilterOpen]= useState(false)
  const[isSortOpen, setIsSortOpen]= useState(false)


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


  const tableHead = ["CaseNo","Type", "Status", "Tracking", "Date", ""];
  const tableContent=[
    {
      id:"A1208",
      type:"Sexual Harrassment",
      status:"Pending",
      color:"#EAC400",
      bgcolor:"#EAC4001A",
      width:"35.88px",
    },
    {
      id:"A2051",
      type:"Gender-based Violence",
      status:"In progress",
      color:"#3DACF5",
      bgcolor:"#3DACF51A",
      width:"90.27px",
    },
    {
      id:"A2351",
      type:"Rape Issues",
      status:"Resolved",
      color:"#48C9B0",
      bgcolor:"#48C9B01A",
      width:"100%",
    },
    {
      id:"A2051",
      type:"Gender-based Violence",
      status:"Pending",
      color:"#EAC400",
      bgcolor:"#EAC4001A",
      width:"62.27px",
    },
    {
      id:"A2051",
      type:"Gender-based Violence",
      status:"Pending",
      color:"#EAC400",
      bgcolor:"#EAC4001A",
      width:"62.27px",
    },
    {
      id:"A2051",
      type:"Gender-based Violence",
      status:"Pending",
      color:"#EAC400",
      bgcolor:"#EAC4001A",
      width:"62.27px",
    },
  ]

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
        <button><RxDashboard size={24}/></button>
        <button onClick={handleFilterOpen}><HiOutlineAdjustmentsVertical size={24}/>Filter</button>
      </div>
      </div>
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
            />
            ))}
          </tbody>
        </table>
      </div>


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
      </div>
    </div>  
  </>
  )
}


function ReportList({ id, type, status, color, bgcolor, width }) {
  const[isDetailsOpen, setIsDetailsOpen]= useState(false)
  
  function handleOpenDetails(){
    setIsDetailsOpen(prev => !prev)
}

function handleCloseDetails(){
  setIsDetailsOpen(false)
}
  const today = new Date();
  const formattedDate = today.toDateString();

  const progressWidth = (status === "Resolved" || status === "Closed") ? "100%" : width;

  return (
    <>
    <tr>
      <td>{id}</td>
      <td>{type}</td>
      <td 
        style={{ color: color, background: bgcolor }} 
        className='status'
      >
        {status}
      </td>
      <td>
        <div className='progress-bar'>
          <div 
            className='progress' 
            style={{ width: progressWidth}}
          ></div>
        </div>
      </td>
      <td>{formattedDate}</td>
      <td><button className='icon' onClick={handleOpenDetails}><HiDotsHorizontal /></button></td>
    </tr>


    {isDetailsOpen &&
    <div className='submenu-dropdown'>
    <div onClick={handleCloseDetails} className='close-icon'><IoMdClose size={25}/></div>
    <div className='options'>
      <button>Details</button>
      <button>Download pdf</button>
      <button>Share</button>
      <button>Archive</button> 
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
export default Reports 