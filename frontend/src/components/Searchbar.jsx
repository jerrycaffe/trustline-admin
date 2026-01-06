import React from 'react'
import profilePic from '../assets/profilepic.png'
import '../css/Searchbar.css'
import { CiSearch } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from 'react-router-dom';

const Searchbar = () => {
  return (
    <div className='searchbar'>
    <div className='search'>
        <input type='text' placeholder='Search' />
        <div className='search-icon'><CiSearch size={30}/></div>
    </div>
    <div className='searchbar-right'>
        <Link to="/notification" className="link"><div className='notification-icon'><IoMdNotificationsOutline size={30}/></div></Link>
       <Link to="/user-profile" className="link"> <img src={profilePic} alt='image' /></Link>
    </div>
    </div>
  )
}

export default Searchbar