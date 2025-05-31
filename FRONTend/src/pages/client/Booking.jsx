import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, CircularProgress, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Booking.css';
import axios from 'axios';

function Booking() {
  const { car_id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ user_id: '', username: '' });
  const [car, setCar] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to book a car');
          return;
        }

        // Fetch user details
        const userResponse = await axios.get('http://localhost:3277/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userResponse.data.success) {
          setUser(userResponse.data.user);
        } else {
          setError('Failed to fetch user details');
        }

        // Fetch car details
        const carResponse = await axios.get(`http://localhost:3277/cars/${car_id}`);
        if (carResponse.data.success) {
          setCar(carResponse.data.car);
        } else {
          setError('Car not found');
        }
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [car_id]);

  const handleConfirmBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3277/bookings',
        { car_id, booking_date: bookingDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message, { position: 'top-right' });
        setTimeout(() => navigate('/home', { replace: true }), 3000);
      } else {
        toast.error(response.data.message || 'Booking failed', { position: 'top-right' });
      }
    } catch (err) {
      toast.error('Network error. Please try again.', { position: 'top-right' });
      console.error(err);
    }
  };

  const handleBackToHome = () => {
    navigate(`/cars/${car.car_type}`);
  };

  if (loading) return <CircularProgress style={{ display: 'block', margin: '50px auto' }} />;
  if (error) return <p className="error">{error}</p>;

  return (
    <section className="booking-container">
      <div className="header-container">
        <button className="back-button" onClick={handleBackToHome} title="Back to Home">
          ← Back
        </button>
        <h2 className="booking-heading">Book Your Car</h2>
      </div>
      <div className="user-info">
        <p>User ID: {user.user_id}</p>
        <p>Username: {user.username}</p>
      </div>
      {car && (
        <div className="car-details">
          <h3>{car.car_name}</h3>
          <img
            src={car.image || '/images/default-car.jpg'}
            alt={car.car_name}
            className="car-image"
            onError={(e) => (e.target.src = '/images/default-car.jpg')}
          />
          <p>Model: {car.car_model}</p>
          <p>Type: {car.car_type}</p>
          <p>Engine: {car.car_enginetype}</p>
          <p>Price: ${car.car_price.toLocaleString()}</p>
          <p>Availability: {car.available ? 'Available' : 'Not Available'}</p>
          <TextField
            label="Booking Date"
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            style={{ margin: '10px 0' }}
            inputProps={{ min: new Date().toISOString().split('T')[0] }} // Prevent past dates
          />
          <Button
            variant="contained"
            className="confirm-button"
            onClick={handleConfirmBooking}
            disabled={!car.available}
          >
            Confirm Booking
          </Button>
        </div>
      )}
      <ToastContainer />
    </section>
  );
}

export default Booking;