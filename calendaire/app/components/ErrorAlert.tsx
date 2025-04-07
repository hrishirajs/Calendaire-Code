"use client";

import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ErrorAlertProps {
  message?: string;
  onClose?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export function ErrorAlert({ 
  message = "An error occurred while processing your request.",
  onClose,
  autoHide = true,
  duration = 10000
}: ErrorAlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onClose]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-4 right-4 max-w-xs w-full z-50 animate-in slide-in-from-top duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-red-200 dark:border-red-900 overflow-hidden">
        <div className="bg-red-50 dark:bg-red-900/20 p-3 flex items-start gap-3">
          <AlertCircle className="size-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-700 dark:text-red-300">Error</h3>
            <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
              {message}
            </p>
          </div>
          <button 
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
} 