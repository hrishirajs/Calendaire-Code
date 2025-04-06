"use client";

import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { format } from "date-fns";

interface SelectedDateInfoProps {
  selectedDate: CalendarDate | null;
}

export function SelectedDateInfo({ selectedDate }: SelectedDateInfoProps) {
  if (!selectedDate) {
    return <div className="mt-4 text-sm">Please select a date on the calendar.</div>;
  }

  const date = selectedDate.toDate(getLocalTimeZone());
  const formattedDate = format(date, "EEEE, MMMM d, yyyy");

  return (
    <div className="mt-4">
      <h3 className="font-semibold text-lg">Selected Date:</h3>
      <p className="text-md text-muted-foreground">{formattedDate}</p>
    </div>
  );
} 