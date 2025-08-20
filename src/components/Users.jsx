import React, { useState } from 'react'
import '../css/Users.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import { IoIosRefresh } from "react-icons/io";

import aina from '../assets/aina.png'
import wade from '../assets/wade.png'
import jenny from '../assets/jenny.png'
import jane from '../assets/jane.png'

import { HiDotsHorizontal } from "react-icons/hi";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";

const Users = () => {

  const tableHead = ["Name","Type","Date Registered","Last Login","Ongoing Cases","Closed Cases", ""]

const topTableContent = [
  {
   image:jenny,
   name:"Jenny Wilson",
   type:"Victim",
   lastLogin:"Today",
   ongoingCases:"0",
   closedCases:"0"
  },
  {
   image:wade,
   name:"Wade Warren",
   type:"Victim",
   lastLogin:"Today",
   ongoingCases:"0",
   closedCases:"0"
  },
]

const secondTableContent = [
  {
   image:aina,
   name:"Modupe Aina",
   type:"Victim",
   lastLogin:"Today",
   ongoingCases:"2",
   closedCases:"0"
  },
  {
   image:aina,
   name:"Modupe Aina",
   type:"Victim",
   lastLogin:"Today",
   ongoingCases:"2",
   closedCases:"0"
  },
  {
   image:jane,
   name:"Jane Doe",
   type:"Witness",
   lastLogin:"Yesterday",
   ongoingCases:"1",
   closedCases:"2"
  },
  {
   image:jane,
   name:"Jane Doe",
   type:"Witness",
   lastLogin:"Yesterday",
   ongoingCases:"1",
   closedCases:"2"
  },
  {
   image:jenny,
   name:"Jenny Wilson",
   type:"Victim",
   lastLogin:"Today",
   ongoingCases:"0",
   closedCases:"0"
  },
  {
   image: jenny,
   name:"Jenny Wilson",
   type:"Victim",
   lastLogin:"Today",
   ongoingCases:"0",
   closedCases:"0"
  },
  {
   image:wade,
   name:"Wade Warren",
   type:"Witness",
   lastLogin:"Yesterday",
   ongoingCases:"4",
   closedCases:"0"
  },
  {
   image:wade,
   name:"Wade Warren",
   type:"Witness",
   lastLogin:"Yesterday",
   ongoingCases:"4",
   closedCases:"0"
  },
]

  return (
    <div className='users-container'>
      <Searchbar />
      <Sidebar />
      <div className='users'>
        <div className='header'>
          <p>Users Management</p>
          <div className='header-right'>
            <div className='buttons'>
              <button>Send Message <IoMdAdd /></button>
              <button><IoIosRefresh/>Refresh</button>
            </div>
          </div>
        </div>
        <div className='new-users'>
          <div className='head'>
              <p>New Users
              <span>View Users as they register</span>
              </p>
              <button><HiOutlineAdjustmentsVertical size={20}/>Filter</button>
          </div>
        <table>
          <thead>
            <tr>
              {tableHead.map((value, index) => (
                <th key={index}>{value}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topTableContent.map((value, index) => (
            <List 
              key={index}
              image={value.image}
              name={value.name}
              type={value.type}
              lastLogin={value.lastLogin}
              ongoingCases={value.ongoingCases}
              closedCases={value.closedCases}
            /> 
            ))}
          </tbody>
        </table>
        </div>

        <div className='every-user'>
          <div className='head'>
              <p>Users
              <span>View all users here</span>
              </p>
              <button><HiOutlineAdjustmentsVertical size={20}/>Filter</button>
          </div>
        <table>
          <thead>
            <tr>
              {tableHead.map((value, index) => (
                <th key={index}>{value}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {secondTableContent.map((value, index) => (
            <List 
              key={index}
              image={value.image}
              name={value.name}
              type={value.type}
              lastLogin={value.lastLogin}
              ongoingCases={value.ongoingCases}
              closedCases={value.closedCases}
            /> 
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}

function  List({image, name, type, lastLogin, ongoingCases, closedCases}){
    const[isDetailsOpen, setIsDetailsOpen]= useState(false)
    
    function handleOpenDetails(){
      setIsDetailsOpen(prev => !prev)
  }
  
  function handleCloseDetails(){
    setIsDetailsOpen(false)
  }
  return(
    <>
  <tr>
    <td className='name'><img src={image} />{name}</td>
    <td>{type}</td>
    <td>15th July, 2025</td>
    <td>{lastLogin}</td>
    <td>{ongoingCases}</td>
    <td>{closedCases}</td>
    <td ><button className='details' onClick={handleOpenDetails}><HiDotsHorizontal size={25}/></button></td>
  </tr>

  {isDetailsOpen &&
      <div className='submenu-dropdown'>
      <div onClick={handleCloseDetails} className='close-icon'><IoMdClose size={25}/></div>
      <div className='options'>
        <button>Details</button>
        <button>Share</button>
        <button>Deactivate</button> 
      </div>
    </div>}
  </>)
}

export default Users 