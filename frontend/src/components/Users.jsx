import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../css/Users.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import { IoIosRefresh } from "react-icons/io";

import aina from '../assets/aina.png'
import wade from '../assets/wade.png'
import jenny from '../assets/jenny.png'
import jane from '../assets/jane.png'

import { HiDotsHorizontal } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";

const Users = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const tableHead = ["Name","Type","Date Registered","Last Login","Ongoing Cases","Closed Cases", ""]

const topTableContent = [
  {
   image:jenny,
   name:"Jenny Wilson",
   type:"Victim",
   email: "jennywilson@gmail.com",
   phoneNumber: "+234 811 345 2201",
   dateRegistered: "12th June, 2024",
   lastLogin:"Today",
   ongoingCases:"0",
   closedCases:"0"
  },
  {
   image:wade,
   name:"Wade Warren",
   type:"Victim",
   email: "wadewarren@gmail.com",
   phoneNumber: "+234 803 445 2245",
   dateRegistered: "5th July, 2024",
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
   email: "modupe077@gmail.com",
   phoneNumber: "+234 801 886 7528",
   dateRegistered: "12th June, 2024",
   lastLogin:"Today",
   ongoingCases:"3",
   closedCases:"8"
  },
  {
   image:aina,
   name:"Modupe Aina",
   type:"Victim",
   email: "modupe077@gmail.com",
   phoneNumber: "+234 801 886 7528",
   dateRegistered: "12th June, 2024",
   lastLogin:"Today",
   ongoingCases:"3",
   closedCases:"8"
  },
  {
   image:jane,
   name:"Jane Doe",
   type:"Witness",
   email: "janedoe@gmail.com",
   phoneNumber: "+234 808 100 9920",
   dateRegistered: "20th May, 2024",
   lastLogin:"Yesterday",
   ongoingCases:"1",
   closedCases:"2"
  },
  {
   image:jane,
   name:"Jane Doe",
   type:"Witness",
   email: "janedoe@gmail.com",
   phoneNumber: "+234 808 100 9920",
   dateRegistered: "20th May, 2024",
   lastLogin:"Yesterday",
   ongoingCases:"1",
   closedCases:"2"
  },
  {
   image:jenny,
   name:"Jenny Wilson",
   type:"Victim",
   email: "jennywilson@gmail.com",
   phoneNumber: "+234 811 345 2201",
   dateRegistered: "12th June, 2024",
   lastLogin:"Today",
   ongoingCases:"0",
   closedCases:"0"
  },
  {
   image: jenny,
   name:"Jenny Wilson",
   type:"Victim",
   email: "jennywilson@gmail.com",
   phoneNumber: "+234 811 345 2201",
   dateRegistered: "12th June, 2024",
   lastLogin:"Today",
   ongoingCases:"0",
   closedCases:"0"
  },
  {
   image:wade,
   name:"Wade Warren",
   type:"Witness",
   email: "wadewarren@gmail.com",
   phoneNumber: "+234 803 445 2245",
   dateRegistered: "5th July, 2024",
   lastLogin:"Yesterday",
   ongoingCases:"4",
   closedCases:"0"
  },
  {
   image:wade,
   name:"Wade Warren",
   type:"Witness",
   email: "wadewarren@gmail.com",
   phoneNumber: "+234 803 445 2245",
   dateRegistered: "5th July, 2024",
   lastLogin:"Yesterday",
   ongoingCases:"4",
   closedCases:"0"
  },
]

function handleOpenUserDetails(user) {
  const sourcePath = `${location.pathname}${location.search}${location.hash}`
  navigate('/users/details', { state: { user, from: sourcePath } })
}

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
          <div className='users-table-shell'>
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
                  user={value}
                  image={value.image}
                  name={value.name}
                  type={value.type}
                  dateRegistered={value.dateRegistered}
                  lastLogin={value.lastLogin}
                  ongoingCases={value.ongoingCases}
                  closedCases={value.closedCases}
                  onOpenDetails={handleOpenUserDetails}
                /> 
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='every-user'>
          <div className='head'>
              <p>Users
              <span>View all users here</span>
              </p>
              <button><HiOutlineAdjustmentsVertical size={20}/>Filter</button>
          </div>
          <div className='users-table-shell'>
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
                  user={value}
                  image={value.image}
                  name={value.name}
                  type={value.type}
                  dateRegistered={value.dateRegistered}
                  lastLogin={value.lastLogin}
                  ongoingCases={value.ongoingCases}
                  closedCases={value.closedCases}
                  onOpenDetails={handleOpenUserDetails}
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

function  List({ user, image, name, type, dateRegistered, lastLogin, ongoingCases, closedCases, onOpenDetails }){
    const[isDetailsOpen, setIsDetailsOpen]= useState(false)
    
    function handleOpenDetails(){
      setIsDetailsOpen(prev => !prev)
  }
  
  // function handleCloseDetails(){
  //   setIsDetailsOpen(false)
  // }
  
  return(
    <>
  <tr onClick={() => onOpenDetails(user)}>
    <td className='name'><img src={image} />{name}</td>
    <td>{type}</td>
    <td>{dateRegistered}</td>
    <td>{lastLogin}</td>
    <td>{ongoingCases}</td>
    <td>{closedCases}</td>
    <td className='action-cell'>
      <button className='details' onClick={(event) => { event.stopPropagation(); handleOpenDetails(); }}><HiDotsHorizontal size={20}/></button>
      {isDetailsOpen &&
        <div className='submenu-dropdown'>
          <div className='options'>
            <button onClick={(event) => { event.stopPropagation(); onOpenDetails(user); }}>Details</button>
            <button>Share</button>
            <button>Deactivate</button>
          </div>
        </div>}
    </td>
  </tr>
  </>)
}

export default Users 