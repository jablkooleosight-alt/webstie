import React from 'react';

export function Button({ children, onClick, size, className }) {
  const sizes = { sm: 'px-2 py-1 text-sm', md: 'px-4 py-2' };
  return (
    <button onClick={onClick} className={`${sizes[size] || sizes.md} bg-blue-500 text-white rounded ${className}`}>
      {children}
    </button>
  );
}