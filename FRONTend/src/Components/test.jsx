import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <header className="header">
        <div className="header-container">
          {/* Logo Section */}
          <div className="logo">
            <img src="../public/logo.jpg" alt="Street Drift Logo" className="logo-img" />
            <h3 className="logo-title">Street Drift</h3>
          </div>

          {/* Hamburger Menu for Mobile */}
          <button className="hamburger" onClick={toggleMenu} aria-label="Toggle navigation menu">
            <svg
              className="hamburger-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>

          {/* Navigation, Search, and Buttons */}
          <div className={`nav-container ${isMenuOpen ? 'nav-open' : 'nav-closed'}`}>
            {/* Navigation Links */}
            <nav className="navlinks-container">
              <ul className="lists">
                <li>
                  <Link to="/home" className="nav-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="nav-link">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="nav-link">
                    Services
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Search Bar */}
            <div className="search-container">
              <input type="text" placeholder="Search cars..." className="search-input" />
            </div>

            {/* Login/Register Buttons */}
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login-btn">
                Login
              </Link>
              <Link to="/register" className="auth-btn register-btn">
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;