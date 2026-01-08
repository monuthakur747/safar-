import React from 'react';

const Button = ({ children, className, onClick }) => {
  return (
    <button
      className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;