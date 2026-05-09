import React, { useState } from 'react'
import 'chart.js/auto'
import { Bar, Line } from 'react-chartjs-2'
import '../css/Analytics.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'

import graph1 from '../assets/graph1.png'
import graph2 from '../assets/graph2.png'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('monthly')

  const demographicLevels = [
    { level: '100 level', width: '80%' },
    { level: '300 level', width: '40%' },
    { level: '200 level', width: '40%' },
    { level: '500 level', width: '40%' },
    { level: '400 level', width: '40%' },
    { level: 'Jupeb', width: '40%' },
  ]

  const dashboardCards = [
    { text: 'new users', number: '20', percent: '+15', image: graph1, color: '#48C9B0', bgcolor: '#48C9B01A' },
    { text: 'new reports', number: '17', percent: '-0.15', image: graph2, color: '#FF0909', bgcolor: '#FF09091A' },
    { text: 'total users', number: '205', percent: '+15', image: graph1, color: '#48C9B0', bgcolor: '#48C9B01A' },
    { text: 'total reports', number: '317', percent: '+15', image: graph1, color: '#48C9B0', bgcolor: '#48C9B01A' },
  ]

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
          pointStyle: 'rect',
          padding: 20,
          color: '#2a3a41',
          font: { size: 12, weight: 500 },
        },
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#2a3a41',
        bodyColor: '#2a3a41',
        borderColor: '#ececf3',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#8b8f96', font: { size: 11 } },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5, color: '#8b8f96', font: { size: 11 } },
        grid: { color: '#ececf3' },
        border: { display: false },
      },
    },
    elements: {
      line: { borderWidth: 2 },
      point: { radius: 0, hoverRadius: 4 },
    },
  }

  return (
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
              {dashboardCards.map((value, index) => (
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
                <p>Reports Analytics</p>
                <select onChange={(event) => setTimeRange(event.target.value)} value={timeRange}>
                  <option value='daily'>Daily</option>
                  <option value='weekly'>Weekly</option>
                  <option value='monthly'>Monthly</option>
                </select>
              </div>
              {(timeRange === 'monthly' || timeRange === 'daily') && (
                <div className='monthly'>
                  <Line
                    data={{
                      labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'],
                      datasets: [
                        {
                          label: 'GBV',
                          data: [7, 5, 10, 13, 16, 14, 15, 11],
                          borderColor: '#FF7C33',
                          backgroundColor: '#FF7C33',
                          tension: 0.45,
                        },
                        {
                          label: 'Sexual Harassment',
                          data: [3, 6, 7, 14, 10, 8, 10, 16],
                          borderColor: '#FF3389',
                          backgroundColor: '#FF3389',
                          tension: 0.45,
                        },
                        {
                          label: 'Rape Issues',
                          data: [0, 4, 9, 6, 5, 17, 14, 8],
                          borderColor: '#A537FB',
                          backgroundColor: '#A537FB',
                          tension: 0.45,
                        },
                      ],
                    }}
                    options={lineOptions}
                  />
                </div>
              )}
              {timeRange === 'weekly' && (
                <div className='weekly'>
                  <Line
                    data={{
                      labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
                      datasets: [
                        {
                          label: 'GBV',
                          data: [5, 8, 11, 9, 14, 16, 12],
                          borderColor: '#FF7C33',
                          backgroundColor: '#FF7C33',
                          tension: 0.45,
                        },
                        {
                          label: 'Sexual Harassment',
                          data: [4, 5, 6, 10, 9, 12, 11],
                          borderColor: '#FF3389',
                          backgroundColor: '#FF3389',
                          tension: 0.45,
                        },
                        {
                          label: 'Rape Issues',
                          data: [2, 4, 7, 11, 14, 10, 8],
                          borderColor: '#A537FB',
                          backgroundColor: '#A537FB',
                          tension: 0.45,
                        },
                      ],
                    }}
                    options={lineOptions}
                  />
                </div>
              )}
            </div>
            <div className='right'>
              <Barchart description='Active Users' />
            </div>
          </div>

          <div className='third-section'>
            <div className='left'>
              <div className='left-header'>
                <p>Demographic Distribution of Incidents</p>
                <select>
                  <option value='level'>Level</option>
                </select>
              </div>
              <div className='level'>
                {demographicLevels.map((item) => (
                  <Level key={item.level} level={item.level} width={item.width} />
                ))}
              </div>
            </div>
            <div className='right'>
              <Barchart description='New Users' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Dashboardcard({ text, number, percent, image, color, bgcolor }) {
  return (
    <div className='card'>
      <div className='card-content'>
        <p>{text.toUpperCase()}</p>
        <p>{number} <span style={{ color: color, background: bgcolor }}>{percent}%</span></p>
      </div>
      <img src={image} alt='metric graph' />
    </div>
  )
}

function Barchart({ description }) {
  const [timeRange, setTimeRange] = useState('monthly')

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#8b8f96', font: { size: 11 } },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5, color: '#8b8f96', font: { size: 11 } },
        grid: { color: '#ececf3' },
        border: { display: false },
      },
    },
  }

  return (
    <div className='bar-chart'>
      <div className='right-header'>
        <div className='header-left'>
          <p>{description}</p>
          <p>4th-10th Aug</p>
        </div>
        <select onChange={(event) => setTimeRange(event.target.value)} value={timeRange}>
          <option value='daily'>Daily</option>
          <option value='weekly'>Weekly</option>
          <option value='monthly'>Monthly</option>
        </select>
      </div>

      {(timeRange === 'monthly' || timeRange === 'weekly' || timeRange === 'daily') && (
        <div className='chart'>
          <Bar
            data={{
              labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
              datasets: [
                {
                  label: '',
                  data: [11, 17, 25, 7, 13, 17, 7],
                  backgroundColor: ['#D9D9D9', '#D9D9D9', '#837AEF', '#D9D9D9', '#D9D9D9', '#D9D9D9', '#D9D9D9'],
                  borderRadius: 5,
                  borderSkipped: false,
                },
              ],
            }}
            options={barOptions}
          />
        </div>
      )}
    </div>
  )
}

function Level({ level, width }) {
  return (
    <div className='progress'>
      <p>{level}<span>{width}</span></p>
      <div className='progress-bar'>
        <div className='inner' style={{ width: width }}></div>
      </div>
    </div>
  )
}

export default Analytics