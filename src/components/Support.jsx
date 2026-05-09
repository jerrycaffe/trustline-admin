import React, { useMemo, useState } from 'react'
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
import { IoMdAdd } from "react-icons/io";

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

const tableHead = ["", "ID", "Requester", "Topic", "Priority", "Date Created", ""]

const newTickets = [
  {
    id:"18754",
    image:aina,
    name:"Modupe Aina",
    topic: "Account access issue",
    createdAt: "2026-04-24",
    priority:"Low",
  },
  {
    id:"18755",
    image:aina,
    name:"Modupe Aina",
    topic: "Evidence upload failed",
    createdAt: "2026-04-23",
    priority:"Medium",
  },
  {
    id:"18756",
    image:aina,
    name:"Modupe Aina",
    topic: "Case status delay",
    createdAt: "2026-04-22",
    priority:"Low",
  },
  {
    id:"18757",
    image:aina,
    name:"Modupe Aina",
    topic: "Unsafe content report",
    createdAt: "2026-04-22",
    priority:"Low",
  },
  {
    id:"18759",
    image:aina,
    name:"Modupe Aina",
    topic: "Emergency escalation",
    createdAt: "2026-04-21",
    priority:"High",
  },
]

const inProgressTickets = [
  {
    id:"18810",
    image:jane,
    name:"Jane Cooper",
    topic: "Harassment report review",
    createdAt: "2026-04-19",
    priority:"High",
  },
  {
    id:"18811",
    image:wade,
    name:"Wade Warren",
    topic: "Sensitive media verification",
    createdAt: "2026-04-18",
    priority:"Medium",
  },
  {
    id:"18812",
    image:jenny,
    name:"Jenny Wilson",
    topic: "Duplicate submission",
    createdAt: "2026-04-17",
    priority:"Low",
  },
]

const Support = () => {
  const [openMenuRowId, setOpenMenuRowId] = useState(null)

  const totalTickets = useMemo(() => (
    newTickets.length + inProgressTickets.length
  ), [])

  const resolvedPct = useMemo(() => (
    Math.round((78 / totalTickets) * 100)
  ), [totalTickets])

  function toggleRowMenu(rowId) {
    setOpenMenuRowId((prev) => (prev === rowId ? null : rowId))
  }

  function closeRowMenu() {
    setOpenMenuRowId(null)
  }

  return (
    <div className='support-container'>
      <Searchbar />
      <Sidebar />

      <main className='support' onClick={closeRowMenu}>
        <div className='support-inner'>
          <div className='support-header'>
            <div>
              <p>Support</p>
              <span>Track and resolve user tickets with your moderation team.</span>
            </div>
            <button type='button'>
              Create ticket
              <IoMdAdd />
            </button>
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

          <div className='support-summary'>
            <span>Resolution efficiency</span>
            <div className='summary-track'>
              <div className='summary-fill' style={{ width: `${resolvedPct}%` }} />
            </div>
            <strong>{resolvedPct}% resolved this week</strong>
          </div>

          <TicketTable
            title={`New Tickets (${newTickets.length})`}
            subtitle='Recently created and awaiting assignment'
            rows={newTickets}
            tableHead={tableHead}
            openMenuRowId={openMenuRowId}
            onToggleRowMenu={toggleRowMenu}
          />

          <TicketTable
            title='Tickets in Progress'
            subtitle='Being actively handled by support agents'
            rows={inProgressTickets}
            tableHead={tableHead}
            openMenuRowId={openMenuRowId}
            onToggleRowMenu={toggleRowMenu}
          />
        </div>
      </main>
    </div>
  )
}

const Card = ({img, title, num, bg}) => {
  return (
    <div className='supportcard'>
      <div className='support-card' style={{background:bg}}>
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

const TicketTable = ({
  title,
  subtitle,
  rows,
  tableHead,
  openMenuRowId,
  onToggleRowMenu,
}) => {
  return (
    <section className='tickets'>
      <div className='ticket-head'>
        <p>
          {title}
          <span>{subtitle}</span>
        </p>
        <button type='button'>
          <FaLongArrowAltUp size={18} />
          <FaLongArrowAltDown size={18} />
        </button>
      </div>

      <div className='support-table-shell'>
        <table>
          <thead>
            <tr>
              {tableHead.map((value, index) => (
                <th key={index}>{value}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((value) => (
              <Tablecontent
                key={value.id}
                id={value.id}
                image={value.image}
                name={value.name}
                topic={value.topic}
                createdAt={value.createdAt}
                priority={value.priority}
                isMenuOpen={openMenuRowId === value.id}
                onToggleMenu={() => onToggleRowMenu(value.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

const Tablecontent = ({
  id,
  image,
  name,
  topic,
  createdAt,
  priority,
  isMenuOpen,
  onToggleMenu,
}) => {
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

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
}

  function handleMenuClick(event) {
    event.stopPropagation()
    onToggleMenu()
  }

  return (
    <>
      <tr>
        <td><input type='checkbox' /></td>
        <td>#{id}</td>
        <td className='requester'><img src={image} alt={name} />{name}</td>
        <td>{topic}</td>
        <td><div className='priority' style={{ background, color }}>{priority}</div></td>
        <td>{formatDate(createdAt)}</td>
        <td className='actions-cell'>
          <button type='button' className='details' onClick={handleMenuClick}>
            <HiDotsHorizontal size={20} />
          </button>

          {isMenuOpen && (
            <div className='submenu-dropdown'>
              <div className='options'>
                <button type='button'>Open</button>
                <button type='button'>Share</button>
                <button type='button'>Delete</button>
              </div>
            </div>
          )}
        </td>
      </tr>
    </>
  )
}

export default Support 