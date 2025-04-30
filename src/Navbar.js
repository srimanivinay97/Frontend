import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaUserCircle } from 'react-icons/fa';

const Navbar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const profileIconRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [profilePicture, setProfilePicture] = useState(localStorage.getItem('profilePicture'));

  useEffect(() => {
    const storedMenuState = sessionStorage.getItem('navbarIsOpen');
    if (storedMenuState === 'true') {
      setIsOpen(true);
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(prev => {
      const newState = !prev;
      sessionStorage.setItem('navbarIsOpen', newState);
      return newState;
    });
  };

  const toggleProfileDropdown = (event) => {
    event.stopPropagation();
    setProfileOpen(prev => !prev);
  };

  const goToPage = (path) => {
    navigate(path);
    setIsOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    sessionStorage.removeItem('navbarIsOpen');
    navigate('/login');
    setProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target) &&
        !profileIconRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.navbar}>
        <FaBars onClick={toggleMenu} style={styles.icon} />
        <h3 style={styles.logo} onClick={() => goToPage('/Dashboard')}>My App</h3>

        <div
          style={styles.profileIconContainer}
          onClick={toggleProfileDropdown}
          ref={profileIconRef}
        >
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" style={styles.profileIcon} />
          ) : (
            <FaUserCircle style={styles.profileIcon} />
          )}
        </div>
      </div>

      {isOpen && <div style={styles.overlay} onClick={toggleMenu}></div>}

      <div style={{
        ...styles.sideMenu,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
      }}>
        <div
          onClick={() => goToPage('/Dashboard')}
          style={{
            ...styles.menuItem,
            ...(location.pathname === '/Dashboard' ? styles.activeMenuItem : {})
          }}
        >
          Dashboard
        </div>
        <div
          onClick={() => goToPage('/Calendar')}
          style={{
            ...styles.menuItem,
            ...(location.pathname === '/Calendar' ? styles.activeMenuItem : {})
          }}
        >
          Calendar
        </div>
        <div
          onClick={() => goToPage('/Mohurtam')}
          style={{
            ...styles.menuItem,
            ...(location.pathname === '/Mohurtam' ? styles.activeMenuItem : {})
          }}
        >
          Mohurtam
        </div>
      </div>

      {profileOpen && (
        <div ref={profileDropdownRef} style={styles.dropdown}>
          <div onClick={() => goToPage('/Profile')} style={styles.dropdownItem}>Profile</div>
          <div onClick={() => goToPage('/Help')} style={styles.dropdownItem}>Help</div>
          <div onClick={handleLogout} style={{ ...styles.dropdownItem, color: 'red' }}>Logout</div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    zIndex: 1,
  },
  navbar: {
    background: '#333',
    color: 'white',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 2000,
  },
  icon: {
    fontSize: '24px',
    cursor: 'pointer',
    marginRight: '15px',
  },
  logo: {
    margin: 0,
    cursor: 'pointer',
  },
  sideMenu: {
    position: 'absolute',
    top: '50px',
    left: 0,
    width: '200px',
    height: 'calc(100vh - 50px)',
    background: '#444',
    paddingTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 1000,
  },
  menuItem: {
    padding: '15px 20px',
    color: '#fff',
    textDecoration: 'none',
    borderBottom: '1px solid #555',
    cursor: 'pointer',
  },
  activeMenuItem: {
    backgroundColor: '#555',
    fontWeight: 'bold',
  },
  overlay: {
    position: 'fixed',
    top: '50px',
    left: 200,
    width: '100vw',
    height: 'calc(100vh - 50px)',
    backgroundColor: 'rgba(251, 247, 247, 0.3)',
    zIndex: 1500,
  },
  profileIconContainer: {
    marginLeft: 'auto',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '@keyframes pulse': {
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.05)' },
  '100%': { transform: 'scale(1)' },
},
  profileIcon: {
    fontSize: '30px',
    color: 'white',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    objectFit: 'cover',
    animation: 'pulse 3s infinite ease-in-out', // continuous slow pulse
  },
  dropdown: {
    position: 'absolute',
    top: '50px',
    right: 0,
    backgroundColor: '#444',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 2000,
    width: '180px',
    marginTop: '10px',
    animation: 'fadeIn 0.3s ease-out',
  },
  dropdownItem: {
    padding: '10px 15px',
    color: '#fff',
    cursor: 'pointer',
    borderBottom: '1px solid #555',
  },
};

export default Navbar;
