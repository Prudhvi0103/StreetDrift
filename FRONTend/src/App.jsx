import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './Components/Header'
import Home from './Routes/Home';
import Landing from './Pages/CLIENT/landing';
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import ServiceBanner from './Components/servicebanner';
import AdminLogin from './pages/admin/Adminlogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
     <Header/>

     <Routes>
      {/* <Route path="/home" element={<Home />} /> */}
      <Route path='/home' element={<Landing />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/services' element={<ServiceBanner />} />
      <Route path='/admin/login' element={<AdminLogin />} />
      <Route path='/admin/dashboard' element={<AdminDashboard />} />
      
      
    </Routes>
    
    </BrowserRouter>
    </>
  )
}

export default App
