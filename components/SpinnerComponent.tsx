
import React from 'react';

const SpinnerComponent: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`animate-spin-slow rounded-full ${sizeClasses[size]} border-qms-primary border-t-transparent`}></div>
  );
};

export default SpinnerComponent;
    