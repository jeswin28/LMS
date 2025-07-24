import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md'
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`
      bg-white rounded-xl shadow-sm border border-gray-100
      ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''}
      ${paddingClasses[padding]}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;