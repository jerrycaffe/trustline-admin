import React from 'react'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import '../css/Incidents.css'

import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { IoIosRefresh } from "react-icons/io";

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${day}-${month}-${year}`
}

const Incidents = () => {
  const newReportHead =["Case No.", "Type", "Date", ""]
  const newReportContent =[
  {
    id:"A1208",
    type:"Sexual Harassment",
    date: "02-07-24"
  },
  {
    id:"A2051",
    type:"Gender-based violence",
    date: "22-06-24"
  },
  {
    id:"A2351",
    type:"Rape Issues",
    date: "12-06-24"
  },
  {
    id:"A2351",
    type:"Rape Issues",
    date: "12-06-24"
  },
]

  const ongoingCasesHead = ["Case No.", "Type", "Date", "Status", "Tracking"]
  const OngoingCasesContent = [
    {
      id:"A1208",
      type:"Sexual Harassment",
      date: "02-07-24",
      text:"Questioning of victims",
      status: "In Progress",
    },
    { 
      id:"A2051",
      type:"Gender-based violence",
      date: "22-06-24",
      text:"Referring of victims for selfcare/checkup",
      status: "In Progress",
    },
    {
      id:"A2351",
      type:"Rape Issues",
      date: "12-06-24",
      text:"Referring of victims for selfcare/checkup",
      status: "In Progress",
    },
    { 
      id:"A2351",
      type:"Rape Issues",
      date: "12-06-24",
      text:"Submission of case reports to the VC's office",
      status: "In Progress"
    }
  ]

  return (
    <div className='incidents-container'>
      <Searchbar />
      <Sidebar />
      <div className='incidents'>
      <div className='incidents-head'>
        <p>Incidents Management</p>
      <div className="head-right">
        <button><IoIosRefresh size={18}/>Refresh</button>
        <button><HiOutlineAdjustmentsVertical size={18}/>Filter</button>
      </div>
      </div>

      <div className='incident-card new-report'>
        <div className='incident-card-header'>
          <p>New Reports</p>
          <p>See new reports as they come in</p>
        </div>
        <div className='incident-table-shell'>
          <table>
            <thead>
              <tr>
              {newReportHead.map((value, index) => (
                <th key={index}>{value}</th>
              ))}
              </tr>
            </thead>
            <tbody>
            {newReportContent.map((value, index) => (
              <Newreport
                key={index}
                id={value.id}
                type={value.type}
                date={value.date}
              />
            ))}
            </tbody>
          </table>
        </div>
      </div>

        <div className='incident-card ongoing-cases'>
        <div className='incident-card-header'>
          <p>Ongoing Cases</p>
          <p>See the status of ongoing cases</p>
        </div>
        <div className='incident-table-shell'>
          <table>
            <thead>
              <tr>
                {ongoingCasesHead.map((value, index) => (
                  <th key={index}>{value}</th>
                ))}
              </tr>
            </thead>
            <tbody>
            {OngoingCasesContent.map((value, index) => (
              <OngoingCases 
                key={index}
                id={value.id}
                type={value.type}
                date={value.date}
                text={value.text}
                status={value.status}
              />
              ))}
            </tbody>
          </table>
        </div>
        </div>
       
      </div>

    </div>
  )
}

function Newreport({id, type, date}){
  return(
    <>
    <tr>
    <td>{id}</td>
    <td>{type}</td>
    <td>{date}</td>
    <td><button className='incident-view-btn'>View</button></td>
    </tr>
    </>

  )

}

function OngoingCases({id, type, date, text, status}){

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
  return(
    <>
    <tr>
    <td>{id}</td>
    <td>{type}</td>
    <td>{date}</td>
    <td><span className='status' style={{background, color}}>{status}</span></td>
    <td><div className='text'>{text}</div></td>
    </tr>
    </>

  )
}

export default Incidents 