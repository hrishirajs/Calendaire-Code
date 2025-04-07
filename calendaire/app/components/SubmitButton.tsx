"use client";

import React, { useTransition, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CalendarCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmitButtonProps {
  text: string;
  className?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ text, className }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  
  // Log state changes for debugging
  useEffect(() => {
    if (buttonClicked) {
      console.log("Button was clicked");
    }
  }, [buttonClicked]);
  
  useEffect(() => {
    if (isPending) {
      console.log("Form submission is pending");
    } else if (submitCount > 0) {
      console.log("Form submission completed");
    }
  }, [isPending, submitCount]);
  
  return (
    <>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800 mb-3">
          <p className="text-xs text-red-700 dark:text-red-300 flex items-center">
            <AlertCircle className="size-3.5 mr-1.5 text-red-600 dark:text-red-400" />
            {error}
          </p>
        </div>
      )}
      <Button 
        type="submit" 
        className={cn(
          "w-full relative font-medium py-6 shadow-md transition-all",
          "hover:shadow-lg hover:translate-y-[-1px]",
          isPending ? "bg-primary/80" : "",
          className
        )}
        onClick={() => {
          setError(null); // Clear any previous errors
          setButtonClicked(true);
          console.log("Submit button clicked - " + new Date().toISOString()); 
          
          // Check if parent form has all required fields filled
          const form = document.querySelector('form');
          if (form) {
            const isValid = form.checkValidity();
            if (!isValid) {
              console.log("Form validation failed");
              return; // Let the browser handle the validation
            }
            
            console.log("Form validation passed");
            
            // Log form data for debugging
            const formData = new FormData(form);
            console.log("Form data:", Object.fromEntries(formData.entries()));
          }
          
          startTransition(() => {
            // Transition will be handled by the server action
            setSubmitCount(prev => prev + 1);
          });
        }}
        disabled={isPending}
      >
        <div className="flex items-center justify-center gap-2">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <CalendarCheck className="size-4" />
          )}
          <span>{text}</span>
        </div>
      </Button>
    </>
  );
}; 