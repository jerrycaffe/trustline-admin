import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/Sidebar.css';
import { FaRegFileLines, FaRegUser } from 'react-icons/fa6';
import { RxDashboard } from 'react-icons/rx';
import { BiPieChartAlt2, BiSupport, BiLogOut, BiErrorCircle } from 'react-icons/bi';
import { RiStackLine } from 'react-icons/ri';
import { FaHandHoldingHeart } from 'react-icons/fa';
import { IoIosSettings } from 'react-icons/io';
import TrustlineLogo from './TrustlineLogo';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: RxDashboard },
  { label: 'Reports', path: '/reports', icon: FaRegFileLines },
  { label: 'Incidents', path: '/incidents', icon: BiErrorCircle },
  { label: 'Users', path: '/users', icon: FaRegUser },
  { label: 'Resources', path: '/resources', icon: RiStackLine },
  { label: 'Analytics', path: '/analytics', icon: BiPieChartAlt2 },
  { label: 'Zen', path: '/zen', icon: FaHandHoldingHeart, badge: 1 },
  { label: 'Support', path: '/support', icon: BiSupport },
  { label: 'Settings', path: '/settings', icon: IoIosSettings },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('activeSidebar');
    navigate('/login', { replace: true });
  };

  return (
    <aside className='sidebar'>
      <div className='sidebar-top'>
        <Link to='/dashboard' className='sidebar-logo'>
          <TrustlineLogo className='sidebar-logo-icon' size={28} />
          <span className='sidebar-logo-text'>Trustline</span>
        </Link>

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
