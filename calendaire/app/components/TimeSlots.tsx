"use client"
import React, { useEffect, useState } from 'react';
import { format, addMinutes, parseISO, isSameDay, isAfter, parse } from 'date-fns';
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
        
        // Generate slots based on the user's configured availability
        generateTimeSlots(availabilityData);
      } catch (error) {
        console.error("Error fetching availability:", error);
        setTimeSlots([]);
        setApiError((error as Error).message || String(error));
      }
    };
    
    // Generate time slots for the selected date based on availability
    const generateTimeSlots = (availability: Availability) => {
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
          
          // Check if this hour is available in hourly settings
          if (hourlyAvailabilityMap[hour]) {
            slots.push(format(currentTime, 'HH:mm'));
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

  // Group time slots into morning, afternoon, evening
  const morningSlots = timeSlots.filter(time => {
    const hour = parseInt(time.split(':')[0], 10);
    return hour < 12;
  });

  const afternoonSlots = timeSlots.filter(time => {
    const hour = parseInt(time.split(':')[0], 10);
    return hour >= 12 && hour < 17;
  });

  const eveningSlots = timeSlots.filter(time => {
    const hour = parseInt(time.split(':')[0], 10);
    return hour >= 17;
  });

  const formatAmPm = (hour: number) => {
    return hour >= 12 ? 'PM' : 'AM';
  };
  
  const formatHour = (hour: number) => {
    return hour % 12 || 12;
  };

  const renderTimeGroup = (slots: string[], title: string, icon: React.ReactNode) => {
    if (slots.length === 0) return null;
    
    return (
      <div>
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {icon}
            <span className="ml-2 text-base font-medium text-foreground">{title}</span>
          </div>
          <div className="ml-3 px-2 py-0.5 rounded-full bg-muted/50 text-xs font-medium text-muted-foreground">
            {slots.length} slots
          </div>
        </div>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-2"
        >
          {slots.map((time) => {
            const [hoursStr, minutesStr] = time.split(':');
            const hour = parseInt(hoursStr, 10);
            const minutes = minutesStr;
            const ampm = formatAmPm(hour);
            const hour12 = formatHour(hour);
            
            return (
              <motion.div key={time} variants={item}>
                <button
                  onClick={() => handleTimeSelect(time)}
                  disabled={isLoading}
                  className={`
                    relative px-4 h-12 rounded-full transition-all duration-200
                    ${selectedTime === time 
                      ? 'bg-primary text-primary-foreground font-medium shadow-sm' 
                      : 'text-foreground hover:bg-primary/10 hover:text-primary'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <div className="flex items-baseline space-x-1">
                    <span className="text-base tabular-nums">{hour12}:{minutes}</span>
                    <span className="text-xs">{ampm}</span>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );
  };

  const isToday = isSameDay(selectedDate, new Date());

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-lg font-medium mb-8 text-center md:text-left flex items-center justify-center md:justify-start">
        <Clock className="size-4 mr-2 text-primary" />
        Available Times
      </h2>
      {timeSlots.length > 0 ? (
        <div className="space-y-10">
          {renderTimeGroup(morningSlots, "Morning", <Sunrise className="size-4 text-amber-500" />)}
          {renderTimeGroup(afternoonSlots, "Afternoon", <Sun className="size-4 text-orange-500" />)}
          {renderTimeGroup(eveningSlots, "Evening", <Sunset className="size-4 text-indigo-500" />)}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center py-10"
        >
          {apiError ? (
            <>
              <AlertCircle className="mx-auto mb-3 size-8 text-red-500" />
              <p className="font-medium text-red-600 dark:text-red-400">Error loading time slots</p>
              <p className="text-sm mt-2 text-muted-foreground max-w-[250px] mx-auto">{apiError}</p>
            </>
          ) : isToday ? (
            <>
              <AlertCircle className="mx-auto mb-3 size-8 text-amber-500" />
              <p className="font-medium text-amber-700 dark:text-amber-400">No available time slots for today</p>
              <p className="text-sm mt-2 text-muted-foreground">Please select a future date to see available slots.</p>
            </>
          ) : (
            <>
              <Clock className="mx-auto mb-3 size-8 text-muted-foreground/70" />
              <p className="font-medium text-foreground/80">No available time slots</p>
              <p className="text-sm mt-2 text-muted-foreground">The host doesn't have available times for this date.</p>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}; 