import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Radio, FormLabel, FormControlLabel, RadioGroup } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/auth.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobileNumber: '',
    age: '',
    gender: 'female', // Default to match schema
    address: {
      landmark: '',
      city: '',
      pincode: '',
    },
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      // Convert age and mobileNumber to numbers
      const updatedValue =
        name === 'age' || name === 'mobileNumber' ? (value === '' ? '' : Number(value)) : value;
      setFormData({ ...formData, [name]: updatedValue });
    }
  };

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'password', 'mobileNumber', 'age', 'gender'];

    // Check if required fields are filled
    for (let field of requiredFields) {
      const value = formData[field];
      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (typeof value === 'number' && (isNaN(value) || value <= 0))
      ) {
        return { isValid: false, message: 'Please fill all required fields!' };
      }
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return { isValid: false, message: 'Please enter a valid email address!' };
    }

    // Mobile number must be 10 digits
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      return { isValid: false, message: 'Mobile number must be 10 digits!' };
    }

    // Age must be between 18 and 100
    if (formData.age < 18 || formData.age > 100) {
      return { isValid: false, message: 'Age must be between 18 and 100!' };
    }

    return { isValid: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) {
      toast.error(validation.message, { position: 'top-right' });
      return;
    }

    // Prepare data to send (omit address if all fields are empty to use schema default)
    const dataToSend = { ...formData };
    const isAddressEmpty =
      !formData.address.landmark && !formData.address.city && !formData.address.pincode;
    if (isAddressEmpty) {
      delete dataToSend.address; // Let schema use default
    }

    try {
      const response = await fetch('http://localhost:3277/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message, { position: 'top-right' });
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setTimeout(() => navigate('/home'), 3000); // 3-second delay before redirect
      } else {
        toast.error(data.message || 'Registration failed', { position: 'top-right' });
      }
    } catch (err) {
      toast.error('Network error. Please try again.', { position: 'top-right' });
      console.error(err);
    }
  };

  return (
    <section className="auth-container">
      <div className="auth-form">
        <h2>Register for Street Drift</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <TextField
              required
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              fullWidth
            />
          </div>
          <div className="form-group">
            <TextField
              required
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              fullWidth
            />
          </div>
          <div className="form-group">
            <TextField
              required
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="new-password"
              fullWidth
            />
          </div>
          <div className="form-group">
            <TextField
              required
              label="Mobile Number"
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              fullWidth
            />
          </div>
          <div className="form-group">
            <TextField
              required
              label="Age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              InputProps={{ inputProps: { min: 18, max: 100 } }}
              fullWidth
            />
          </div>
          <div className="form-group">
            <FormLabel required>Gender</FormLabel>
            <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
          </div>
          {/* Optional Address Fields */}
          <div className="form-group">
            <TextField
              label="Landmark"
              type="text"
              name="address.landmark"
              value={formData.address.landmark}
              onChange={handleChange}
              placeholder="Enter landmark (optional)"
              fullWidth
            />
          </div>
          <div className="form-group">
            <TextField
              label="City"
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              placeholder="Enter city (optional)"
              fullWidth
            />
          </div>
          <div className="form-group">
            <TextField
              label="Pincode"
              type="text"
              name="address.pincode"
              value={formData.address.pincode}
              onChange={handleChange}
              placeholder="Enter pincode (optional)"
              fullWidth
            />
          </div>
          <Button type="submit" variant="contained" className="auth-button">
            Register
          </Button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
      <ToastContainer />
    </section>
  );
}

export default Register;