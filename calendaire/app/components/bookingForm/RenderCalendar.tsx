"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "./Calendar";
import { useState, useEffect } from "react";
import {
  CalendarDate,
  DateValue,
  getLocalTimeZone,
  today,
  parseDate,
} from "@internationalized/date";
import { SelectedDateInfo } from "./SelectedDateInfo";

interface AvailabilityDay {
  id: string;
  day: string;
  isActive: boolean;
}

interface iAppProps {
  daysofWeek: AvailabilityDay[];
}

export function RenderCalendar({ daysofWeek }: iAppProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Debug logging
  console.log("Availability days received:", daysofWeek);

  const [date, setDate] = useState<CalendarDate>(() => {
    const dateParam = searchParams.get("date");
    return dateParam ? parseDate(dateParam) : today(getLocalTimeZone());
  });

  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      setDate(parseDate(dateParam));
    }
  }, [searchParams]);

  const handleChangeDate = (date: DateValue) => {
    console.log("Selected date:", date);
    setDate(date as CalendarDate);
    const url = new URL(window.location.href);

    url.searchParams.set("date", date.toString());

    router.push(url.toString());
  };

  const isDateUnavailable = (date: DateValue) => {
    // Map day names to their positions (0-6)
    const dayMap: Record<string, number> = {
      "Monday": 0,
      "Tuesday": 1,
      "Wednesday": 2,
      "Thursday": 3,
      "Friday": 4,
      "Saturday": 5,
      "Sunday": 6
    };
    
    // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
    const jsDayOfWeek = date.toDate(getLocalTimeZone()).getDay();
    
    // Convert JS day (0-6, starting with Sunday) to our day format (Monday-Sunday)
    const dayName = Object.keys(dayMap).find(
      day => dayMap[day] === (jsDayOfWeek === 0 ? 6 : jsDayOfWeek - 1)
    );
    
    if (!dayName) return true; // If we can't determine the day, mark as unavailable
    
    const dayAvailability = daysofWeek.find(d => d.day === dayName);
    return !dayAvailability?.isActive;
  };

  return (
    <div>
      <Calendar
        minValue={today(getLocalTimeZone())}
        defaultValue={today(getLocalTimeZone())}
        value={date}
        onChange={handleChangeDate}
        isDateUnavailable={isDateUnavailable}
      />
      <SelectedDateInfo selectedDate={date} />
    </div>
  );
}