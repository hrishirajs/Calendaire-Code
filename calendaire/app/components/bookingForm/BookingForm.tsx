"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarCheck } from "lucide-react";
import { useState } from "react";
import { ErrorAlert } from "../ErrorAlert";
import { Button } from "@/components/ui/button";

interface BookingFormProps {
  eventTypeId: string;
  userName: string;
  time: string;
  date: string;
  duration: number;
}

export function BookingForm({ eventTypeId, userName, time, date, duration }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("Submitting form with values:", {
        eventTypeId,
        userName,
        time,
        date,
        duration,
        name,
        email
      });
      
      const formData = new FormData();
      formData.append('eventTypeId', eventTypeId);
      formData.append('userName', userName);
      formData.append('fromTime', time);
      formData.append('eventDate', date);
      formData.append('meetingLength', duration.toString());
      formData.append('name', name);
      formData.append('email', email);
      
      // Submit the form data using fetch instead of form action
      const response = await fetch('/api/book', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to book meeting');
      }
      
      // If successful, redirect to success page
      window.location.href = '/success';
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(err.message || 'An error occurred while booking your meeting');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-y-5">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      
      <form onSubmit={handleSubmit}>
        <div className="bg-primary/5 p-4 rounded-lg mb-2">
          <h3 className="text-sm font-semibold mb-1 flex items-center">
            <CalendarCheck className="size-4 mr-2 text-primary" />
            Just a few details to finish
          </h3>
          <p className="text-xs text-muted-foreground">We&apos;ll send the meeting details to your email.</p>
        </div>
        
        <div className="flex flex-col gap-y-2 mt-4">
          <Label htmlFor="name" className="text-sm font-medium">Your Name</Label>
          <Input 
            id="name"
            name="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name" 
            className="focus-visible:ring-primary/50"
            required
          />
        </div>

        <div className="flex flex-col gap-y-2 mt-4">
          <Label htmlFor="email" className="text-sm font-medium">Your Email</Label>
          <Input 
            id="email"
            name="email" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" 
            className="focus-visible:ring-primary/50"
            required
          />
        </div>

        <div className="mt-4">
          <Button 
            type="submit" 
            className="w-full relative font-medium py-6 shadow-md transition-all hover:shadow-lg hover:translate-y-[-1px]"
            disabled={isSubmitting}
          >
            <div className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <CalendarCheck className="size-4" />
                  Confirm Booking
                </>
              )}
            </div>
          </Button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-2">
          By confirming, you agree to our scheduling terms and conditions.
        </p>
      </form>
    </div>
  );
} 