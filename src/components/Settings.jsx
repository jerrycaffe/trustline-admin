import React, { useState } from 'react'
import '../css/Settings.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'

import logo1 from '../assets/logo1.png'
import logo2 from '../assets/logo2.png'
import icon1 from '../assets/icon1.png'
import icon2 from '../assets/icon2.png'
import icon3 from '../assets/icon3.png'

const Settings = () => {
  const [activeTab, setActiveTab] = useState("General"); // default tab

  return (
    <div className='settings-container'>
      <Searchbar />
      <Sidebar />
      <div className='settings'>
        <p>Settings</p>

        {/* Navigation */}
        <div className='navigation'>
          <button 
            className={activeTab === "General" ? "active" : ""} 
            onClick={() => setActiveTab("General")}
          >
            General
          </button>
          <button 
            className={activeTab === "Reporting" ? "active" : ""} 
            onClick={() => setActiveTab("Reporting")}
          >
            Reporting
          </button>
          <button 
            className={activeTab === "Notification" ? "active" : ""} 
            onClick={() => setActiveTab("Notification")}
          >
            Notification
          </button>
          <button 
            className={activeTab === "Data Management" ? "active" : ""} 
            onClick={() => setActiveTab("Data Management")}
          >
            Data Management
          </button>
          <button 
            className={activeTab === "Security" ? "active" : ""} 
            onClick={() => setActiveTab("Security")}
          >
            Security
          </button>
          <button 
            className={activeTab === "Integration" ? "active" : ""} 
            onClick={() => setActiveTab("Integration")}
          >
            Integration
          </button>
          <button 
            className={activeTab === "System" ? "active" : ""} 
            onClick={() => setActiveTab("System")}
          >
            System
          </button>
          <button 
            className={activeTab === "Customization" ? "active" : ""} 
            onClick={() => setActiveTab("Customization")}
          >
            Customization
          </button>
        </div>

        {activeTab === "General" && (
          <div className='general'>
            <div className='app-branding'>
              <p>App Branding</p>
              <div className='app-name'>
                <p>APP NAME</p>
                <button>Trustline</button>
              </div>
              <div className='app-logo'>
                <p>APP LOGO</p>
                <div className='logos'>
                  <button><img src={logo1} alt="logo1" /></button>
                  <button><img src={logo2} alt="logo2" /></button>
                </div>
              </div>
              <div className='app-icon'>
                <p>APP ICON</p>
                <div className='icons'>
                  <button><img src={icon1} alt="icon1" /></button>
                  <button><img src={icon2} alt="icon2" /></button>
                  <button><img src={icon3} alt="icon3" /></button>
                </div>
              </div>
              <div className='languages'>
                <p>Languages</p>
                <div className='options'>
                  <p><input type='checkbox' /> English(US)</p>
                  <p><input type='checkbox' /> Espanol (Spanish)</p>
                  <p><input type='checkbox' /> Francias (French)</p>
                  <p><input type='checkbox' /> Italiano (Italian)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Reporting" && (
          <div className='reporting'>
            <p>Reporting Content</p>
          </div>
        )}

        {activeTab === "Notification" && (
          <div className='notification'>
            <p>Notification Content</p>
          </div>
        )}

        {activeTab === "Data Management" && (
          <div className='data-management'>
            <p>Data Management Content</p>
          </div>
        )}

        {activeTab === "Security" && (
          <div className='security'>
            <p>Security Content</p>
          </div>
        )}

        {activeTab === "Integration" && (
          <div className='integration'>
            <p>Integration Content</p>
          </div>
        )}

        {activeTab === "System" && (
          <div className='system'>
            <p>System Content</p>
          </div>
        )}

        {activeTab === "Customization" && (
          <div className='customization'>
            <p>Customization Content</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings
