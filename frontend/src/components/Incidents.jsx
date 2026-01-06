import React from 'react'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import '../css/Incidents.css'

import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { IoIosRefresh } from "react-icons/io";

const Incidents = () => {
  const newReportHead =["CaseNo", "Type", "Date", ""]
  const newReportContent =[
  {
    id:"A1208",
    type:"Sexual Harrassment"
  },
  {
    id:"A2051",
    type:"Gender-based Violence"
  },
  {
    id:"A2351",
    type:"Rape Issues"
  },
  {
    id:"A2351",
    type:"Rape Issues"
  },
]

  const ongoingCasesHead = ["CaseNo", "Type", "Date", "Status", "Tracking"]
  const OngoingCasesContent = [
    {
      id:"A1208",
      type:"Sexual Harrassment",
      text:"Questioning of victims",
      status: "In Progress",
    },
    { 
      id:"A2051",
      type:"Gender-based Violence",
      text:"Referring of victims for selfcare/checkup",
      status: "In Progress",
    },
    {
      id:"A2351",
      type:"Rape Issues",
      text:"Referring of victims for selfcare/checkup",
      status: "In Progress",
    },
    { 
      id:"A2351",
      type:"Rape Issues",
      text:"Referring of victims for selfcare/checkup",
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
        <button><IoIosRefresh size={24}/>Refresh</button>
        <button><HiOutlineAdjustmentsVertical size={24}/>Filter</button>
      </div>
      </div>

      <div className='new-report'>
        <p>New Report</p>
        <p>See new reports as they come in</p>
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
            />
          ))}
          </tbody>
        </table>
      </div>

        <div className='ongoing-cases'>
        <div className='cases'>
        <p>Ongoing Cases</p>
        <p>See the status of ongoing cases</p>
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

function Newreport({id, type}){
function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2); // 25 for 2025
  return `${day}-${month}-${year}`;
}

  return(
    <>
    <tr>
    <td>{id}</td>
    <td>{type}</td>
    <td>{formatDate(new Date())}</td>
    <td><button>View</button></td>
    </tr>
    </>

  )

}

function OngoingCases({id, type, text, status}){

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2); // 25 for 2025
  return `${day}-${month}-${year}`;
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
  return(
    <>
    <tr>
    <td>{id}</td>
    <td>{type}</td>
    <td>{formatDate(new Date())}</td>
    <td><div className='status' style={{background, color}}>{status}</div></td>
    <td><div className='text'>{text}</div></td>
    </tr>
    </>

  )
}

export default Incidents 