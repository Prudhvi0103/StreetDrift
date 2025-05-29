import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';
import bannerImage from '../../../public/banner-car.jpg';

function Landing() {
  return (
    <section className="banner">
      <div className="banner-overlay"></div>
      <div className="banner-content">
        <h1 className="banner-title">
          Drive Your <span className="highlight">Dream Car</span>
        </h1>
        <p className="banner-subtitle">
          Rent. Drive. Enjoy. Premium vehicles at your fingertips.
        </p>
        <div className="cta-container">
          <Link to="/cars" className="cta-primary">
            Browse Our Fleet
          </Link>
          <Link to="/about" className="cta-secondary">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Landing;