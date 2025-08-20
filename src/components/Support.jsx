import React, { useState } from 'react'
import '../css/Support.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'

import invoice1 from '../assets/invoice1.png'
import invoice2 from '../assets/invoice2.png'
import invoice3 from '../assets/invoice3.png'
import invoice4 from '../assets/invoice4.png'
import aina from '../assets/aina.png'
import wade from '../assets/wade.png'
import jenny from '../assets/jenny.png'
import jane from '../assets/jane.png'

import { HiDotsHorizontal } from "react-icons/hi";
import { FaLongArrowAltDown, FaLongArrowAltUp  } from "react-icons/fa";
import { IoMdAdd, IoMdClose } from "react-icons/io";

const supportCard = [
  {
    img: invoice1,
    title:"all tickets",
    num:"112",
    bg:"#837AEFCC",
  },
  {
    img: invoice2,
    title:"resolved",
    num:"78",
    bg:"#48C9B0",
  },
  {
    img: invoice3,
    title:"pending",
    num:"34",
    bg:"#FFA800CC",
  },
  {
    img: invoice4,
    title:"canceled",
    num:"12",
    bg:"#999999CC",
  },
]

const tableHead = [ "","ID", "Requester", "Topic", "Priority", "Date Created", ""]

const tableContent = [
  {
    id:"18754",
    image:aina,
    name:"Modupe Aina",
    priority:"Low",
  },
  {
    id:"18755",
    image:aina,
    name:"Modupe Aina",
    priority:"Medium",
  },
  {
    id:"18756",
    image:aina,
    name:"Modupe Aina",
    priority:"Low",
  },
  {
    id:"18757",
    image:aina,
    name:"Modupe Aina",
    priority:"Low",
  },
  {
    id:"18759",
    image:aina,
    name:"Modupe Aina",
    priority:"High",
  },
]

const Support = () => {
  return (
<div className='support-container'>
<Searchbar />
<Sidebar />
<div className='support'>
  <div className="support-header">
    <p>Support</p>
    <button>Create ticket <IoMdAdd/></button>
  </div>
  <div className='support-cards'>
        {supportCard.map((value, index) => (
        <Card
        key={index}
        img={value.img}
        title={value.title}
        num={value.num}
        bg={value.bg}
        />
        ))}
  </div>
  <div className='tickets'>
    <div className='ticket-head'>
    <p>New Tickets({tableContent.length})<span>View new tickets here</span></p>
    <button><FaLongArrowAltUp size={25}/><FaLongArrowAltDown size={25}/></button>
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
        {tableContent.map((value, index) => (
        <Tablecontent
        key={index} 
        id={value.id}
        image={value.image}
        name={value.name}
        priority={value.priority}
        bgColor={value.bgColor}
        color={value.color}
        />        
        ))}
      </tbody>
    </table>
  </div>

  <div className='tickets'>
    <div className='ticket-head'>
    <p>Tickets in Progress</p>
    <button><FaLongArrowAltUp size={25}/><FaLongArrowAltDown size={25}/></button>
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
        {tableContent.map((value, index) => (
        <Tablecontent
        key={index} 
        id={value.id}
        image={value.image}
        name={value.name}
        priority={value.priority}
        bgColor={value.bgColor}
        color={value.color}
        />        
        ))}
      </tbody>
    </table>
  </div>

</div>
</div>
  )
}

const Card = ({img, title, num, bg}) => {
  return (
    <div className='supportcard'>
      <div className="support-card" style={{background:bg}}>
          <img src={img} />
          <p>{title.toUpperCase()}</p>
          <div className='card-bottom'>
          <p>{num}</p>
          <div className='images'>
          <img src={aina} className='image1'/>
          <img src={jane} className='image2'/>
          <img src={jenny} className='image3'/>
          <img src={wade} className='image4'/>
          </div>
          </div>
        </div>
    </div>
  );
}

const Tablecontent = ({id, image, name, priority}) => {
  const[isDetailsOpen, setIsDetailsOpen]= useState(false)
  
  function handleOpenDetails(){
    setIsDetailsOpen(prev => !prev)
}

function handleCloseDetails(){
  setIsDetailsOpen(false)
}
    let background;
    let color;

  if (priority === "Low") {
    background = "#A3E4D780";
    color = "#005E4C";
  } else if (priority === "Medium") {
    background = "#FEDB4E80";
    color = "#B08D00";
  } else if (priority === "High") {
    background = "#FF787880";
    color = "#FF0909";
  } 
  return(
    <>
    <tr>
      <td><input type='checkbox' /></td>
      <td>#{id}</td>
      <td className='requester'><img src={image}/> {name}</td>
      <td>Loading Error</td>
      <td><div className='priority' style={{background, color}}>{priority}</div></td>
      <td>15th July, 2025</td>
      <td><button className='details' onClick={handleOpenDetails}><HiDotsHorizontal size={25}/></button></td>
    </tr>

    {isDetailsOpen &&
    <div className='submenu-dropdown'>
    <div onClick={handleCloseDetails} className='close-icon'><IoMdClose size={25}/></div>
    <div className='options'>
      <button>Open</button>
      <button>Share</button>
      <button>Delete</button> 
    </div>
  </div>}
  </>)
}

export default Support 