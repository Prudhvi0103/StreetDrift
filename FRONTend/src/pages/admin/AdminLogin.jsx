import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    adminid: '',
    adminPassword: '',
  });
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    const checkAdmin = () => {
      try {
        const admin = JSON.parse(localStorage.getItem('Admin'));
        if (admin?.adminToken) {
          navigate('/admin/dashboard', { replace: true });
        }
      } catch (error) {
        localStorage.removeItem('Admin');
      }
    };
    checkAdmin();
  }, [navigate]);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const submitAdminForm = async (e) => {
    e.preventDefault();
    if (!state.adminid || !state.adminPassword) {
      toast.error(
        <div>
          <span style={{ marginRight: '8px' }}>!</span>
          Please fill in all fields
        </div>,
        {
          position: 'top-center',
          autoClose: 3000,
          style: {
            background: '#d32f2f',
            color: '#ffffff',
            fontSize: '1rem',
            borderRadius: '8px',
          },
        }
      );
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://streetdrift.onrender.com/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state),
      });
      
      const data = await response.json();
      console.log('Backend Response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || `Login failed with status ${response.status}`);
      }

      // More flexible success check
      const isSuccess = data.success || 
                       (data.message && data.message.toLowerCase().includes('success')) || 
                       data.token;
      
      if (!isSuccess) {
        throw new Error(data.message || 'Login failed due to invalid response');
      }

      localStorage.removeItem('Admin');
      localStorage.setItem('Admin', JSON.stringify({ adminToken: data.token }));
      
      toast.success(
        <div>
          <span style={{ marginRight: '8px' }}>✔</span>
          {data.message || 'Login Successful'}
        </div>,
        {
          position: 'top-center',
          autoClose: 1500,
          style: {
            background: '#4caf50',
            color: '#ffffff',
            fontSize: '1rem',
            borderRadius: '8px',
          },
        }
      );
      
      setTimeout(() => navigate('/admin/dashboard', { replace: true }), 100);
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      console.error('Login Error:', errorMessage);
      
      toast.error(
        <div>
          <span style={{ marginRight: '8px' }}>!</span>
          {errorMessage.includes('success') ? 'Login Successful' : errorMessage}
        </div>,
        {
          position: 'top-center',
          autoClose: 3000,
          style: {
            background: '#d32f2f',
            color: '#ffffff',
            fontSize: '1rem',
            borderRadius: '8px',
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin" role="main" aria-labelledby="admin-login-title">
      <div className="top-buttons">
        <Button variant="outlined" className="top-btn">
          <Link className="link" to="/login">
            User Login
          </Link>
        </Button>
        <Button variant="outlined" className="top-btn">
          <Link className="link" to="/home">
            Back to Home
          </Link>
        </Button>
      </div>
      <div className="mainContainer">
        <h1 id="admin-login-title">WELCOME BACK, ADMIN</h1>
        <div className="authWrapper">
          <div className="logo">
            <img src="/logo.jpg" className="Image" alt="Street Drift Logo" loading="lazy" />
          </div>
          <div className="loginContainer">
            <form id="adminLoginForm" onSubmit={submitAdminForm} noValidate>
              <TextField
                required
                label="Admin ID"
                type="text"
                name="adminid"
                onChange={handleChange}
                value={state.adminid}
                fullWidth
                InputLabelProps={{
                  className: state.adminid ? 'filled' : '',
                }}
                className="auth-textfield"
                inputProps={{ 'aria-required': true }}
              />
              <TextField
                required
                label="Password"
                type="password"
                name="adminPassword"
                onChange={handleChange}
                value={state.adminPassword}
                fullWidth
                InputLabelProps={{
                  className: state.adminPassword ? 'filled' : '',
                }}
                className="auth-textfield"
                inputProps={{ 'aria-required': true }}
              />
              <Button
                variant="contained"
                type="submit"
                className="auth-button"
                disabled={loading}
                aria-label={loading ? 'Logging in' : 'Login'}
              >
                {loading ? 'Logging In...' : 'Login Now'}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminLogin;