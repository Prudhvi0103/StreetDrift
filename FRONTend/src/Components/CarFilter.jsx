import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/CarFilter.css';

function CarFilter() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3277/carcat/${category}`);
        if (response.data.success) {
          setCars(response.data.cars);
        } else {
          setError(response.data.message || 'No cars found in this category');
        }
      } catch (err) {
        setError('Failed to fetch cars. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [category]);

  const handleBookNow = (carId) => {
    if (!carId) {
      console.error('Car ID is undefined');
      return;
    }
    console.log('Navigating to booking with car_id:', carId); // Debug log
    navigate(`/booking/${carId}`);
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="car-filter-container">
      <div className="header-container">
        <h2 className="filter-heading">{category.toUpperCase()} CARS</h2>
        <button
          className="back-button"
          onClick={handleBackToHome}
          title="Back to Home"
        >
          ← Back
        </button>
      </div>
      
      {loading && <p className="loading">Loading cars...</p>}
      {error && <p className="error">{error}</p>}
      
      {!loading && !error && cars.length === 0 && (
        <p className="no-cars">No cars found in this category.</p>
      )}
      
      <div className="car-grid">
        {cars.map((car) => (
          <div key={car._id} className="car-card">
            <div className="car-image-container">
              <img
                src={car.image || '/images/default-car.jpg'}
                alt={car.car_name}
                className="car-image"
                onError={(e) => {
                  e.target.src = '/images/default-car.jpg'; // Fallback image
                }}
              />
            </div>
            <div className="car-details">
              <h3 className="car-name">{car.car_name}</h3>
              <p className="car-model">Model: {car.car_model}</p>
              <p className="car-type">Type: {car.car_type}</p>
              <p className="car-enginetype">Engine: {car.car_enginetype}</p>
              <p className="car-price">Price: ₹{car.car_price.toLocaleString()}</p>
              <p className="car-availability">
                Availability: {car.available ? 'Available' : 'Not Available'}
              </p>
              <button
                className="book-now-button"
                onClick={() => handleBookNow(car.car_id)}
                disabled={!car.available}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarFilter;