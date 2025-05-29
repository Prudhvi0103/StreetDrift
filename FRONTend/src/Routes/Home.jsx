import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:4700/');
        // If using a proxy, use: const response = await fetch('/prod');
        if (!response.ok) {
          throw new Error('Failed to fetch car data');
        }
        const data = await response.json();
        setCars(data);
      } catch (err) {
        setError(err.message.includes('Failed to fetch') ? 'CORS error or server unreachable. Please check the server configuration.' : err.message);
      }
    };
    fetchCars();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Car Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car, index) => (
          <div key={car.id} className="car-card bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              src={car.image}
              alt={car.model}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold" style={{color:'black'}}>{car.model.toUpperCase()}</h2>
              <p className="text-gray-600">Year: {car.modelYear}</p>
              <p className="text-gray-600">Type: {car.carType}</p>
              <p className="text-gray-600">Location: {car.location || 'N/A'}</p>
              <p className="text-gray-600">Condition: {car.condition}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;