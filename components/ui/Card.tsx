
import React from 'react';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-[#16213e]/80 backdrop-blur-sm border border-blue-900/50 rounded-lg shadow-lg p-4 sm:p-6 ${className}`}>
      {title && <h3 className="text-lg font-bold text-blue-300 mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
