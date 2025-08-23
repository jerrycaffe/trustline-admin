import React, { useState } from 'react'
import '../css/Analytics.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import {Bar, Doughnut, Line} from "react-chartjs-2";

import { FaArrowRightLong } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";

import graph1 from '../assets/graph1.png'
import graph2 from '../assets/graph2.png'
import map from '../assets/map.png'

const Analytics = () => {
const [timeRange, setTimeRange] = useState("monthly");

function handleChange(e) {
  setTimeRange(e.target.value);
}

const [viewType, setViewType] = useState("location");

function handleViewChange(e) {
  setViewType(e.target.value);
}
const location = [
  {
    location: "Faculty of Science",
    percent: "80%"
  },
  {
    location: "Faculty of Science",
    percent: "75%"
  },
  {
    location: "High Rise Blocks",
    percent: "60%"
  },
  {
    location: "High Rise Blocks",
    percent: "40%"
  },
  {
    location: "Faculty of Arts",
    percent: "55%"
  },
  {
    location: "Lagoon Front",
    percent: "70%"
  },
  {
    location: "Lagoon Front",
    percent: "48%"
  },
]

const Dashboard = [
  {
    text:"new users",
    number:"20",
    percent:"+15",
    image:graph1,
    color:"#48C9B0",
    bgcolor:"#48C9B01A"
  },
  {
    text:"new reports",
    number:"17",
    percent:"-0.15",
    image:graph2,
    color:"#FF0909",
    bgcolor:"#FF09091A",
  },
  {
    text:"total users",
    number:"205",
    percent:"+15",
    image:graph1,
    color:"#48C9B0",
    bgcolor:"#48C9B01A",
  },
  {
    text:"total reports",
    number:"317",
    percent:"+15",
    image:graph1,
    color:"#48C9B0",
    bgcolor:"#48C9B01A",
  }
]

  return (
    <>
<div className='analytics-container'>
      <Searchbar />
      <Sidebar />
<div className='analytics'>
<div className='analytic'>
<div className='first-section'>
      <div className='heading'>
        <p>Dashboard</p>
      </div>
      <div className='cards'>
        {Dashboard.map((value, index) => (
          <Dashboardcard
            key={index} 
            text={value.text}
            number={value.number}
            percent={value.percent}
            image={value.image}
            color={value.color}
            bgcolor={value.bgcolor}
          />
        ))}
     </div>
</div>

<div className='second-section'>
        <div className='left'>
          <div className='left-header'>
          <p>Reports Analysis</p>
          <select onChange={handleChange} value={timeRange}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        {timeRange === "monthly" &&
        <div className='monthly'>
      <Line
        data={{
        labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"],
        datasets: [
        {
        label: "GBV",
        data: [0, 5, 10, 15, 20, 25, 15, 15, 20, 5, 0, 10],
        backgroundColor: "#FF7C33",
        tension: 0.5
        },
        {
        label: "Sexual Harassment",
        data: [3, 7, 5, 10, 15, 20, 18, 15, 12, 8, 4, 15],
        backgroundColor: "#FF3389",
        tension: 0.5
        },
        {
        label: "Rape Issues",
        data: [2, 4, 8, 6, 12, 15, 10, 12, 9, 5, 3, 19],
        backgroundColor: "#A537FB",
        tension: 0.5
        }
      ]
    }}
    />
    </div>}
    {timeRange === "weekly" &&
    <div className="weekly">
      <Line
        data={{
        labels: ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"],
        datasets: [
        {
        label: "GBV",
        data: [0, 5, 10, 15, 20, 25, 10, 15, 20, 5, 0, 10],
        backgroundColor: "#FF7C33",
        },
        {
        label: "Sexual Harassment",
        data: [3, 7, 5, 10, 15, 20, 18, 15, 12, 8, 4, 15],
        backgroundColor: "#FF3389",
        },
        {
        label: "Rape Issues",
        data: [2, 4, 8, 6, 12, 15, 10, 12, 9, 5, 3, 19],
        backgroundColor: "#A537FB",
        }
      ]
    }}
    />
    </div>}
      </div>
      <div className='right'>
        <Barchart description="Active Users"/>
      </div>
</div>

<div className='third-section'>
  <div className='left'>
    <div className='left-header'>
      <p>
        {viewType === "location" ? "Geographic Distribution of Incidents"   : "Demographic Distribution of Incidents"}</p>
      <select value={viewType} onChange={handleViewChange}>
        <option value="location">Location</option>
        <option value="level">Level</option>
      </select>
    </div>
    {viewType === "location" &&
    <div className='location'>
      <img  src={map}/>
      <div className='location-right'>
        {location.map((value, index) => (
          <Location 
          key={index}
          location={value.location}
          percent={value.percent}
          />
        ))}
      </div>
    </div>}
    {viewType === "level" &&
    <div className='level'>
    <Level level="100 Level" width="80%" />
    <Level level="200 Level" width="40%" />
    <Level level="300 Level" width="40%" />
    <Level level="400 Level" width="40%" />
    <Level level="Jupep" width="40%" />
    </div>}
  </div>
  <div className='right'>
        <Barchart description="New Users"/>
    </div>
</div>

</div>
</div>
</div>
</>
  )
}

function Dashboardcard({text, number, percent, image, color, bgcolor}){
  return(
  <>
  <div className='card'>
  <div className='card-content'>
    <p>{text.toUpperCase()}</p>
    <p>{number} <span style={{color:color, background:bgcolor}}>{percent}%</span></p>
    </div>
    <img  src={image} alt='graph'/>
  </div>
  </>

  )
}

function Barchart({description}){
const [timeRange, setTimeRange] = useState("monthly");

function handleChange(e) {
  setTimeRange(e.target.value);
}
  return(
<div className='bar-chart'>
  <div className='right-header'>
   <div className='header-left'>
      <p>{description}</p>
      <p>4th-10th Aug</p>
    </div>
    <select onChange={handleChange} value={timeRange}>
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
    </select>
  </div>
  {timeRange === "monthly" &&
  <div className='chart'>
<Bar
  data={{
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: [
      {
        label: "",
        data: [5, 10, 15, 25, 20, 15, 10],
        backgroundColor: "#837AEF",
       borderRadius: 5,
      },
    ]
  }}
    options={{
      maintainAspectRatio: false}}
/>
  </div>}
</div>
  )
}

function Location({location, percent}){
  return(
    <div className='progress'>
      <p>{location} <span>{percent}</span></p>
      <div className='progress-bar'>
        <div className='inner' style={{width:percent}}></div>
      </div>
    </div>  
  )
}

function Level({level, width}){
  return(
  <div className='progress'>
    <p>{level}<span>{width}</span></p>
    <div className='progress-bar'>
        <div className='inner' style={{width:width}}></div>
    </div>
</div>
  )
}

export default Analytics 