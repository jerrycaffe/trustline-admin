import React, { useState } from 'react'
import '../css/Settings.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'

import logo1 from '../assets/logo1.png'
import logo2 from '../assets/logo2.png'
import icon1 from '../assets/icon1.png'
import icon2 from '../assets/icon2.png'
import icon3 from '../assets/icon3.png'

import { IoMdAdd, IoMdClose  } from "react-icons/io";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("General");

const addReport = [
  {
    title:"Gender-based Violence",
    description:"For violence crimes against females"
  },
  {
    title:"Rape Issue",
    description:"For reporting rape crimes"
  },
  {
    title:"Sexual Harrassment",
    description:"For harrassment crimes"
  },
]  

const customReport = [
 {
    title:"REPORTING FORM",
    content1:"Incident type",
    content2:"Date of Occurence",
    content3:"Location",
    content4:"Description",
 },
 { 
    title:"SIGN UP FORM",
    content1:"Email",
    content2:"Phone Number",
    content3:"Password",
 },
 {
  title:"LOG IN FORM",
  content1:"Email/Phone Number",
  content2:"Password",
 }
]
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
              <p>Report Categories</p>
              <div className='add-reports'>
              {addReport.map((value, index) => (
                <Addreport
                  key={index}
                  title={value.title}
                  description={value.description}
                />
              ))}
              <button>Add new <IoMdAdd/></button>
              </div>

              <div className='custom-form'>
                <p>Custom Form Fields</p>
                 {customReport.map((value, index) =>
                <Customform 
                key={index}
                title={value.title}
                content1={value.content1}
                content2={value.content2}
                content3={value.content3}
                content4={value.content4}
                />
                )}
              </div>
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


function Addreport({title, description}){
  return(
    <div className='add-report'>
      <p>{title}</p>
      <p>{description}</p>
    </div>
  )
}

function Customform({ title, content1, content2, content3, content4 }) {
  
  const [items, setItems] = useState([content1, content2, content3, content4]);

  const handleRemove = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="custom-content">
      <p>{title}</p>
      <div className="added">
        {items.map((item, index) => (
          <button key={index}>
            {item} <IoMdClose onClick={() => handleRemove(index)} />
          </button>
        ))}
      </div>
      <button>
        Add new <IoMdAdd />
      </button>
    </div>
  );
}

export default Settings
