
import React, { useEffect } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'info' | 'warning';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseClasses = 'fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white max-w-sm';
  const typeClasses = {
    info: 'bg-blue-600',
    warning: 'bg-yellow-600',
  };
  const Icon = type === 'warning' ? AlertTriangle : Info;

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <Icon className="h-6 w-6 mr-3" />
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button onClick={onClose} className="ml-4 -mr-2 p-1.5 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast;
