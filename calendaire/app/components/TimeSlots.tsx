"use client"
import React, { useEffect, useState } from 'react';
import { format, addMinutes, parseISO, isSameDay, isAfter, parse, fromUnixTime } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, Sunrise, Sun, Sunset } from 'lucide-react';

interface TimeSlotsProps {
  selectedDate: Date;
  userName: string;
  meetingDuration: number;
}

interface Availability {
  fromTime: string;
  tillTime: string;
  isActive: boolean;
  [key: string]: any; // For hourly availability fields
}

interface BusySlot {
  start_time: number;
  end_time: number;
  status: string;
}

export const TimeSlots: React.FC<TimeSlotsProps> = ({
  selectedDate,
  userName,
  meetingDuration,
}) => {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAvailabilityAndGenerateSlots = async () => {
      try {
        // Clear previous state
        setApiError(null);
        
        // Fetch the user's availability for the selected day
        const dayOfWeek = format(selectedDate, 'EEEE'); // Gets day name like "Monday"
        
        const response = await fetch(`/api/availability?userName=${userName}&day=${dayOfWeek}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API returned ${response.status}: ${errorData.error || 'Unknown error'}`);
        }
        
        const availabilityData: Availability = await response.json();
        
        if (!availabilityData || !availabilityData.isActive) {
          setTimeSlots([]);
          return;
        }

        // Get free/busy data from our API
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const freeBusyResponse = await fetch(`/api/freebusy?userName=${userName}&date=${formattedDate}`);
        
        if (!freeBusyResponse.ok) {
          const errorData = await freeBusyResponse.json();
          throw new Error(`Free/busy API returned ${freeBusyResponse.status}: ${errorData.error || 'Unknown error'}`);
        }
        
        const busySlots: BusySlot[] = await freeBusyResponse.json();
        
        // Generate slots based on the user's configured availability and free/busy data
        generateTimeSlots(availabilityData, busySlots);
      } catch (error) {
        console.error("Error fetching availability:", error);
        setTimeSlots([]);
        setApiError((error as Error).message || String(error));
      }
    };
    
    // Generate time slots for the selected date based on availability and free/busy data
    const generateTimeSlots = (availability: Availability, busySlots: BusySlot[]) => {
      try {
        // Parse the fromTime and tillTime
        const startTime = parse(`${format(selectedDate, 'yyyy-MM-dd')} ${availability.fromTime}`, 'yyyy-MM-dd HH:mm', new Date());
        const endTime = parse(`${format(selectedDate, 'yyyy-MM-dd')} ${availability.tillTime}`, 'yyyy-MM-dd HH:mm', new Date());
        
        // Generate slots based on fromTime and tillTime
        const slots: string[] = [];
        let currentTime = startTime;
        
        // Create a map of hours that are available - working around any potential serialization issues
        const hourlyAvailabilityMap: Record<number, boolean> = {};
        let hasAnyHourlySettings = false;
        
        for (let hour = 0; hour < 24; hour++) {
          const fieldName = `hour${hour}to${hour + 1}`;
          // Use strict equality to true to ensure we're checking for boolean true
          const isAvailable = availability[fieldName] === true;
          hourlyAvailabilityMap[hour] = isAvailable;
          if (isAvailable) hasAnyHourlySettings = true;
        }
        
        // If no hourly settings are enabled but the day is active, default to all hours in range being available
        if (!hasAnyHourlySettings && availability.isActive) {
          for (let hour = 0; hour < 24; hour++) {
            const hourString = `${hour.toString().padStart(2, '0')}:00`;
            if (hourString >= availability.fromTime && hourString < availability.tillTime) {
              hourlyAvailabilityMap[hour] = true;
            }
          }
        }
        
        while (currentTime < endTime) {
          const hour = currentTime.getHours();
          const slotEndTime = addMinutes(currentTime, meetingDuration);
          
          // Check if this hour is available in hourly settings
          if (hourlyAvailabilityMap[hour]) {
            // Check if the slot overlaps with any busy slots
            const isSlotFree = !busySlots.some(busySlot => {
              const busyStart = fromUnixTime(busySlot.start_time);
              const busyEnd = fromUnixTime(busySlot.end_time);
              
              return (
                (currentTime >= busyStart && currentTime < busyEnd) ||
                (slotEndTime > busyStart && slotEndTime <= busyEnd) ||
                (currentTime <= busyStart && slotEndTime >= busyEnd)
              );
            });
            
            if (isSlotFree) {
              slots.push(format(currentTime, 'HH:mm'));
            }
          }
          
          currentTime = addMinutes(currentTime, meetingDuration);
        }
        
        // If the selected date is today, filter out past time slots
        if (isSameDay(selectedDate, new Date())) {
          const now = new Date();
          const filteredSlots = slots.filter(timeSlot => {
            const [hours, minutes] = timeSlot.split(':').map(Number);
            const slotTime = new Date(selectedDate);
            slotTime.setHours(hours, minutes, 0, 0);
            
            // Add a buffer of 30 minutes to not show slots that are too close to the current time
            const bufferTime = new Date(now);
            bufferTime.setMinutes(now.getMinutes() + 30);
            
            return isAfter(slotTime, bufferTime);
          });
          
          setTimeSlots(filteredSlots);
        } else {
          setTimeSlots(slots);
        }
      } catch (error) {
        console.error("Error generating time slots:", error);
        setTimeSlots([]);
      }
    };
    
    fetchAvailabilityAndGenerateSlots();
    setSelectedTime(null); // Reset selection when date changes
  }, [selectedDate, meetingDuration, userName]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsLoading(true);
    
    // Small delay to show loading state for better UX
    setTimeout(() => {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      router.push(`?date=${formattedDate}&time=${time}`);
    }, 300);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div>
      <p className="text-base font-semibold">
        {format(selectedDate, "EEE")}.{" "}
        <span className="text-sm text-muted-foreground">
          {format(selectedDate, "MMM. d")}
        </span>
      </p>

      <div className="mt-3 max-h-[350px] overflow-y-auto">
        {apiError ? (
          <div className="flex items-center justify-center p-4 text-red-500">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span>{apiError}</span>
          </div>
        ) : timeSlots.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {timeSlots.map((slot, index) => (
              <motion.div key={index} variants={item}>
                <Button
                  variant={selectedTime === slot ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleTimeSelect(slot)}
                  disabled={isLoading}
                >
                  {slot}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No available time slots for this date.
          </p>
        )}
      </div>
    </div>
  );
}; 