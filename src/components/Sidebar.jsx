import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/Sidebar.css';
import { FaRegFileLines, FaRegUser } from 'react-icons/fa6';
import { RxDashboard } from 'react-icons/rx';
import { BiLogOut } from 'react-icons/bi';
import { RiStackLine } from 'react-icons/ri';
import { FaHandHoldingHeart } from 'react-icons/fa';
import { IoIosSettings, IoMdClose } from 'react-icons/io';
import logoMark from '../assets/logoimage.png';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: RxDashboard },
  { label: 'Reports', path: '/reports', icon: FaRegFileLines },
  { label: 'Users', path: '/users', icon: FaRegUser },
  { label: 'Resources', path: '/resources', icon: RiStackLine },
  { label: 'Activities', path: '/activities', icon: FaHandHoldingHeart },
  { label: 'Settings', path: '/settings', icon: IoIosSettings },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved === null ? true : saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebarOpen', String(isOpen));
  }, [isOpen]);

  useEffect(() => {
    const handleSidebarSetOpen = (event) => {
      setIsOpen(Boolean(event.detail));
    };

    window.addEventListener('sidebar-set-open', handleSidebarSetOpen);

    return () => {
      window.removeEventListener('sidebar-set-open', handleSidebarSetOpen);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('sidebarOpen');
    navigate('/login', { replace: true });
  };

  if (!isOpen) {
    return (
      <button
        type='button'
        className='sidebar-reopen-btn'
        onClick={() => setIsOpen(true)}
        aria-label='Open navigation menu'
      >
        <span />
        <span />
        <span />
      </button>
    );
  }

  return (
    <aside className='sidebar'>
      <div className='sidebar-top'>
        <div className='sidebar-top-row'>
          <Link to='/dashboard' className='sidebar-logo'>
            <img src={logoMark} alt='TrustLine logo' className='sidebar-logo-icon' />
            <span className='sidebar-logo-text'>Trustline</span>
          </Link>

          <button
            type='button'
            className='sidebar-close-btn'
            onClick={() => setIsOpen(false)}
            aria-label='Close navigation menu'
          >
            <IoMdClose size={20} />
          </button>
        </div>

        <nav className='sidebar-nav'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon className='sidebar-link-icon' />
                <span className='sidebar-link-label'>{item.label}</span>
                {item.badge ? <span className='sidebar-badge'>{item.badge}</span> : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className='sidebar-bottom'>
        <button type='button' className='sidebar-link logout' onClick={handleLogout}>
          <BiLogOut className='sidebar-link-icon' />
          <span className='sidebar-link-label'>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
