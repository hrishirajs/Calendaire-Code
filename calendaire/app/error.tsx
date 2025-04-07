'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { AlertCircle, Home, RefreshCcw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  // Extract the actual error message without the stack trace
  const errorMessage = error.message.split('\n')[0];
  
  // Check if it's a Nylas API error
  const isNylasError = errorMessage.includes('Nylas API error');
  
  // Customize message based on error type
  let userFriendlyMessage = 'Something went wrong';
  let detailedMessage = 'We encountered an issue while processing your request.';
  
  if (errorMessage.includes('User not found')) {
    userFriendlyMessage = 'Host account not found';
    detailedMessage = 'We couldn\'t find the calendar owner\'s account. Please check the booking URL.';
  } else if (errorMessage.includes('User has not connected their calendar')) {
    userFriendlyMessage = 'Calendar not connected';
    detailedMessage = 'The host has not connected their calendar yet. Please contact them to set up their calendar integration.';
  } else if (errorMessage.includes('Event type not found')) {
    userFriendlyMessage = 'Meeting type not found';
    detailedMessage = 'The selected meeting type is no longer available. Please try a different meeting type.';
  } else if (isNylasError) {
    userFriendlyMessage = 'Calendar service error';
    detailedMessage = 'We couldn\'t create the calendar event. This may be due to a temporary issue with the calendar service.';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-slate-50 dark:to-slate-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-red-100 dark:border-red-900 overflow-hidden">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 border-b border-red-100 dark:border-red-900 flex items-start gap-3">
          <AlertCircle className="size-5 text-red-500 dark:text-red-400 mt-0.5" />
          <div>
            <h1 className="text-lg font-semibold text-red-700 dark:text-red-300">{userFriendlyMessage}</h1>
            <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">{detailedMessage}</p>
          </div>
        </div>
        
        <div className="p-6">
          <div className="bg-slate-50 dark:bg-slate-800 rounded p-4 mb-6">
            <p className="text-sm text-muted-foreground font-mono border-l-2 border-red-300 dark:border-red-700 pl-3 break-words">
              {errorMessage}
            </p>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button 
              onClick={reset} 
              className="flex-1"
              variant="outline"
            >
              <RefreshCcw className="size-4 mr-2" />
              Try again
            </Button>
            <Button 
              onClick={() => window.location.href = '/'} 
              className="flex-1"
            >
              <Home className="size-4 mr-2" />
              Go to home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 