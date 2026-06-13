import '../css/Searchbar.css';
import { CiSearch } from 'react-icons/ci';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { IoMdMenu } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Searchbar = () => {
  const handleOpenSidebar = () => {
    window.dispatchEvent(new CustomEvent('sidebar-set-open', { detail: true }));
  };

  return (
    <div className='searchbar'>
      <button
        type='button'
        className='searchbar-menu-button'
        onClick={handleOpenSidebar}
        aria-label='Open navigation menu'
      >
        <IoMdMenu size={22} />
      </button>
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
          <span className='avatar avatar-unisex'>
            <FaUserCircle size={26} />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Searchbar;
