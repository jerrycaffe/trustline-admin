import React, { useState } from 'react'
import 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2'
import '../css/Zen.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import { IoMdAdd } from 'react-icons/io'
import { HiDotsVertical } from 'react-icons/hi'

import dailyBreathing from '../assets/dailybreathing.png'
import windDown from '../assets/winddown.png'

const moodData = [
  { day: 'M', value: 11, color: '#9FD6C7', emoji: '😄' },
  { day: 'T', value: 17, color: '#AED5F7', emoji: '😄' },
  { day: 'W', value: 13, color: '#CDB8EA', emoji: '😅' },
  { day: 'T', value: 8,  color: '#D8C2EA', emoji: '😅' },
  { day: 'F', value: 25, color: '#CFE5DF', emoji: '😄' },
  { day: 'S', value: 17, color: '#E9DFAE', emoji: '🤣' },
  { day: 'S', value: 8,  color: '#EEC8C8', emoji: '😍' },
]

const playedLegend = [
  { label: 'Sleep',      percent: '40%', color: '#7D9BF3' },
  { label: 'Meditation', percent: '25%', color: '#1D458A' },
  { label: 'Journaling', percent: '15%', color: '#E72353' },
  { label: 'Anxiety',    percent: '35%', color: '#5BE4A8' },
]

const exercises = [
  { title: 'Wind down',      image: windDown },
  { title: 'Daily breathing', image: dailyBreathing },
]

const MAX_VALUE = 30

const Zen = () => {
  const [timeRange, setTimeRange] = useState('weekly')

  return (
    <div className='zen-container'>
      <Searchbar />
      <Sidebar />
      <div className='zen'>
        <p className='zen-heading'>Zen Dashboard</p>

        <div className='zen-top'>
          {/* Mood Tracker */}
          <div className='zen-card mood-card'>
            <div className='zen-card-head'>
              <div>
                <p className='zen-card-title'>Mood Tracker</p>
                <p className='zen-card-sub'>4th-10th Aug</p>
              </div>
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                <option value='daily'>Daily</option>
                <option value='weekly'>Weekly</option>
                <option value='monthly'>Monthly</option>
              </select>
            </div>
            <div className='mood-chart'>
              <div className='mood-y-axis'>
                {[30, 25, 20, 15, 10, 5, 0].map((v) => (
                  <span key={v}>{v}</span>
                ))}
              </div>
              <div className='mood-bars'>
                {moodData.map((item, i) => (
                  <div key={i} className='mood-bar-col'>
                    <span className='mood-emoji'>{item.emoji}</span>
                    <div
                      className='mood-bar'
                      style={{
                        height: `${(item.value / MAX_VALUE) * 140}px`,
                        background: item.color,
                      }}
                    />
                    <span className='mood-day'>{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Most Played */}
          <div className='zen-card played-card'>
            <p className='zen-card-title centered'>Most Played Exercises</p>
            <p className='zen-card-sub centered'>This week</p>
            <div className='donut-wrap'>
              <Doughnut
                data={{
                  labels: ['Sleep', 'Meditation', 'Journaling', 'Anxiety'],
                  datasets: [{
                    data: [40, 25, 15, 35],
                    backgroundColor: ['#7D9BF3', '#1D458A', '#E72353', '#5BE4A8'],
                    borderColor: '#ffffff',
                    borderWidth: 3,
                  }],
                }}
                options={{
                  maintainAspectRatio: false,
                  cutout: '58%',
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
            <div className='legend-list'>
              {playedLegend.map((item) => (
                <div key={item.label} className='legend-row'>
                  <span className='legend-dot' style={{ background: item.color }} />
                  <span className='legend-label'>{item.label}</span>
                  <span className='legend-pct'>{item.percent}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Funnel */}
          <div className='zen-card funnel-card'>
            <p className='zen-card-title centered'>Exercise Engagement Funnel</p>
            <div className='funnel-shape'>
              <div className='fseg s1' />
              <div className='fseg s2' />
              <div className='fseg s3' />
            </div>
            <div className='funnel-stats'>
              <div className='fstat'>
                <strong>80%</strong>
                <span>Opens app</span>
              </div>
              <div className='fstat'>
                <strong>50%</strong>
                <span>Starts exercise</span>
              </div>
              <div className='fstat'>
                <strong>20%</strong>
                <span>Completes exercise</span>
              </div>
            </div>
            <div className='funnel-nav'>
              <span>&#8249;</span>
              <p>Daily Breathing</p>
              <span>&#8250;</span>
            </div>
          </div>
        </div>

        {/* Bottom exercises */}
        <div className='zen-bottom'>
          <div className='zen-bottom-head'>
            <div>
              <p className='zen-bottom-title'>Current Zen Exercises</p>
              <p className='zen-bottom-sub'>Edit, add and remove zen exercises</p>
            </div>
            <button className='zen-add-btn'>Add new <IoMdAdd /></button>
          </div>
          <div className='zen-exercise-list'>
            {exercises.map((ex) => (
              <ZenExercise key={ex.title} image={ex.image} title={ex.title} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ZenExercise({ image, title }) {
  return (
    <div className='zen-exercise-row'>
      <div className='ze-left'>
        <img src={image} alt={title} />
        <p>{title}</p>
      </div>
      <div className='ze-body'>
        <p className='ze-desc'>
          This 1 hour exercise helps you to get your mind off things and sets the mood for you to have a good night's rest.
        </p>
        <div className='ze-meta'>
          <div>
            <p>Type: <span>Sleep</span></p>
            <p>Duration: <span>1 hour</span></p>
          </div>
          <div>
            <p>Last played: <span>Today, 01:08am</span></p>
            <p>Most plays: <span>18</span></p>
          </div>
        </div>
      </div>
      <button className='ze-menu'><HiDotsVertical size={18} /></button>
    </div>
  )
}

export default Zen
