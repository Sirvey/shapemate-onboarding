import React from 'react';

interface SparkleProps {
  className?: string;
  fill?: string;
}

export const Sparkle: React.FC<SparkleProps> = ({ className = "w-6 h-6", fill = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <path 
        d="M12 0C12 0 14.5 8 16 9.5C17.5 11 24 12 24 12C24 12 17.5 13 16 14.5C14.5 16 12 24 12 24C12 24 9.5 16 8 14.5C6.5 13 0 12 0 12C0 12 6.5 11 8 9.5C9.5 8 12 0 12 0Z" 
        fill={fill}
      />
    </svg>
  );
};