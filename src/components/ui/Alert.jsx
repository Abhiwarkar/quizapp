// src/components/ui/Alert.jsx
import React from 'react';

const Alert = ({ 
  message, 
  type = 'info', 
  onClose 
}) => {
  const types = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300'
  };

  return (
    <div className={`p-4 rounded-md border ${types[type]} relative`}>
      <span className="block">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;