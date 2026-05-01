import profilePic from '../assets/profilepic.png';
import '../css/Searchbar.css';
import { CiSearch } from 'react-icons/ci';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { Link } from 'react-router-dom';

const Searchbar = () => {
  return (
    <div className='searchbar'>
      <div className='search'>
        <input type='text' placeholder='Search' />
        <span className='search-icon'>
          <CiSearch size={22} />
        </span>
      </div>
      <div className='searchbar-right'>
        <Link to='/notification' className='link' aria-label='Notifications'>
          <button type='button' className='notification-icon'>
            <IoMdNotificationsOutline size={24} />
          </button>
        </Link>
        <Link to='/user-profile' className='link' aria-label='Profile'>
          <span className='avatar'>
            <img src={profilePic} alt='Profile' />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Searchbar;
