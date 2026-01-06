import React, {useState} from 'react'
import '../css/Zen.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import {Bar, Doughnut, Line} from "react-chartjs-2";

import { IoMdClose, IoMdAdd } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";

import dailyBreathing from '../assets/dailybreathing.png'
import windDown from '../assets/winddown.png'

const Zen = () => {
const [timeRange, setTimeRange] = useState("weekly");

function handleChange(e) {
  setTimeRange(e.target.value);
}
  return (
    <div className='zen-container'>
      <Searchbar />
      <Sidebar />
      <div className='zen'>
      <p className='header'>Zen Dashboard</p>
      <div className='top-section'>
      <div className='mood-tracker'>
        <div className='head'> 
        <p>
          Mood Tracker
          <span>4th-10th Aug</span>
        </p>
        <select onChange={handleChange} value={timeRange}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        </div>
        {timeRange === "weekly" && 
        <div className='bar-chart'>
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
        {timeRange === "monthly" && 
        <div className='bar-chart'>
        <Line
          data={{
            labels: ["J", "F", "M", "A", "M", "J", "J","A", "S", "O", "N", "D"],
            datasets: [
              {
                label: "",
                data: [10, 18, 13, 8, 25, 18, 8, 22, 18, 7, 5, 10],
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
      <div className='most-played'>
      <p className='header'>
        Most Played Exercises
        <span>This Week</span>
      </p>
      <div className='pie-chart'>
            <Doughnut
              data={{
                labels: ["Sleep", "Meditation", "Journaling", "Anxiety"],
                datasets: [
                  {
                    labels: "Report",
                    data: [40, 25, 15, 35],
                    backgroundColor: [
                      "#7D9BF3",
                      "#1D458A",
                      "#E72353",
                      "#5BE4A8",
                    ],
                    borderRadius: 4,
                  },
                ],
              }}
            />
      </div>
      </div>
      <div className='most-played'>
      <p className='header'>
        Most Played Exercises
        <span>This Week</span>
      </p>
      <div className='pie-chart'>
            <Doughnut
              data={{
                labels: ["Sleep", "Meditation", "Journaling", "Anxiety"],
                datasets: [
                  {
                    labels: "Report",
                    data: [40, 25, 15, 35],
                    backgroundColor: [
                      "#7D9BF3",
                      "#1D458A",
                      "#E72353",
                      "#5BE4A8",
                    ],
                    borderRadius: 4,
                  },
                ],
              }}
            />
      </div>
      </div>
      </div>

      <div className='bottom-section'>
        <div className='head'>
            <p>Current Zen Exercises
              <span>Edit, add and remove zen exercises</span>
            </p>
          <button>Add New <IoMdAdd/></button>
        </div>
        <div className='zen-exercises'>
        <Zenexercise image={windDown}/>
        <Zenexercise image={dailyBreathing}/>
        <Zenexercise image={windDown}/>
        <Zenexercise image={dailyBreathing}/>
        </div>
      </div>
    </div>
    </div>
  )
}


function Zenexercise({image}){
  //   const[isDetailsOpen, setIsDetailsOpen]= useState(false)
    
  //   function handleOpenDetails(){
  //     setIsDetailsOpen(prev => !prev)
  // }
  
  return(
    <>
  <div className='zen-exercise'>
    <img src={image} />
    <div className='content'>
      <p className=''>This 1 hour exercise helps you to get your mind off things and sets the mood for you to have a good night’s rest.</p>
    <div className='bottom'>
      <div className='bottom-left'>  
        <p>Type: <span>Sleep </span></p>
        <p>Duration: <span> 1 Hour</span></p>
      </div>
      <div className='bottom-right'>  
        <p>Last Played: <span>Today, 10: 08 am </span></p>
        <p>Most Plays: <span> 18</span></p>
      </div>
    </div>
    </div>
    <button /*onClick={handleOpenDetails}*/><HiDotsVertical size={32}/></button>

  {/* {isDetailsOpen &&
      <div className='submenu-dropdown'>
      <div className='options'>
        <button>Details</button>
        <button>Share</button>
        <button>Deactivate</button> 
      </div>
    </div>} */}
</div>
</>)
}
export default Zen 