// src/components/ui/Card.jsx
import React from 'react';

export const Card = ({ 
  children, 
  title, 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
};