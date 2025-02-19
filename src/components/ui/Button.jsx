// src/components/ui/Button.jsx
import React from 'react';

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors duration-200 ease-in-out';
  
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:bg-gray-100',
    danger: 'bg-red-500 hover:bg-red-600 text-white disabled:bg-red-300'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};