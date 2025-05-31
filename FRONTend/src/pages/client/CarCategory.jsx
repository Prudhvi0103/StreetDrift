import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CarCategory.css';

const carCategories = [
  'Sedan',
  'SUV',
  'Hatchback',
  'Truck',
  'Convertible',
  'Coupe'
];

const carImages = {
  'Sedan': "../../../public/sedan.jpg",
  'SUV': "../../../public/suv.jpg",
  'Hatchback': "../../../public/hacthback.jpg",
  'Truck': "../../../public/truck.jpg",
  'Convertible': "../../../public/convetable.jpg",
  'Coupe': "../../../public/Coupe.jpg"
};

function CarCategoryFilter() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/cars/${category.toLowerCase().replace(' ', '-')}`);
  };

  return (
    <div className="category-container">
      <h2 className="category-heading">CAR CATEGORIES</h2>
      
      <div className="category-grid">
        {carCategories.map((category) => (
          <div 
            key={category} 
            className="category-card"
            onClick={() => handleCategoryClick(category)}
          >
            <div className="image-container">
              <img 
                src={carImages[category]} 
                alt={category}
                className="category-image"
                onError={(e) => {
                  e.target.src = '/images/default-car.jpg'; // Fallback image
                }}
              />
            </div>
            <div 
              className="category-name" 
              onClick={() => handleCategoryClick(category)}
              style={{ cursor: 'pointer', fontWeight: 'bold', color: '#007bff', padding: '10px', textAlign: 'center' }}
            >
              {category}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarCategoryFilter;



