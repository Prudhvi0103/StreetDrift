import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/srvicebanner.css';

function ServiceBanner() {
  const navigate = useNavigate();

  const navigateAdminLogin = () => {
    navigate('/admin/login');
  };

  return (
    <div className="bannerContainer">
      <div className="bannerDetails">
        <p className="mainText">
          Give Your Car to Rent <br />
          Share & Earn
        </p>
        <div className="subTextContainer">
          {/* <img src="/group-cars.png" className="groupImage" alt="Group of Cars" /> */}
          <span>Simply list your car on Street Drift and start earning by renting it out hassle-free.</span>
        </div>
        <button className="adminLoginBtn" onClick={navigateAdminLogin}>
          Admin Login <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
      <img src="/banner-car.jpg" className="bannerImage" alt="Car Banner" />
    </div>
  );
}

export default ServiceBanner;

{/* <Link to="/login" onClick={toggleMenu}>
                Log/Reg
              </Link> */}