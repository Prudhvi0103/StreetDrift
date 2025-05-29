import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../public/logo.jpg';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Street Drift Logo" className="logo-img" />
          <h3>Street Drift</h3>
        </div>
       
        <button
          className="hamburger"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
        {isMenuOpen && <div className="overlay" onClick={closeMenu} />}
        <div className={`navlinks-container ${isMenuOpen ? 'open' : ''}`}>
          <nav>
            <ul className="nav-lists">
              <li>
                <Link to="/home" onClick={closeMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={closeMenu}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={closeMenu}>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={closeMenu}>
                  Log/Reg
                </Link>
              </li>
            </ul>
          </nav>
        </div>
       
      </header>
    </>
  );
}

export default Header;


