"use client"
import {
	addMinutes,
	format,
	fromUnixTime,
	isAfter,
	isBefore,
	parse,
  } from "date-fns";
  import prisma from "@/lib/prisma";
  import { Prisma } from "@prisma/client";
  import Link from "next/link";
  import { Button } from "@/components/ui/button";
  import { NylasResponse, GetFreeBusyResponse } from "nylas";
  
  interface iappProps {
	selectedDate: Date;
	userName: string;
	meetingDuration: number;
  }
  
  async function getAvailability(selectedDate: Date, userName: string) {
	const currentDay = format(selectedDate, "EEEE");
  
	const startOfDay = new Date(selectedDate);
	startOfDay.setHours(0, 0, 0, 0);
	const endOfDay = new Date(selectedDate);
	endOfDay.setHours(23, 59, 59, 999);
	const data = await prisma.availability.findFirst({
	  where: {
		day: currentDay as Prisma.EnumDayFilter,
		User: {
		  userName: userName,
		},
	  },
	  select: {
		fromTime: true,
		tillTime: true,
		id: true,
		User: {
		  select: {
			grantEmail: true,
			grantId: true,
		  },
		},
	  },
	});
  
	// Mock Nylas data for now
	const mockNylasData = {
		data: [{
			timeSlots: []
		}]
	};
  
	return { data, nylasCalendarData: mockNylasData };
  }
  
  function calculateAvailableTimeSlots(
	dbAvailability: {
	  fromTime: string | undefined;
	  tillTime: string | undefined;
	},
	nylasData: any,
	date: string,
	duration: number
  ) {
	const now = new Date(); // Get the current time
  
	// Convert DB availability to Date objects
	const availableFrom = parse(
	  `${date} ${dbAvailability.fromTime}`,
	  "yyyy-MM-dd HH:mm",
	  new Date()
	);
	const availableTill = parse(
	  `${date} ${dbAvailability.tillTime}`,
	  "yyyy-MM-dd HH:mm",
	  new Date()
	);
  
	// Extract busy slots from Nylas data
	const busySlots = nylasData.data[0].timeSlots?.map((slot: any) => ({
	  start: fromUnixTime(slot.startTime),
	  end: fromUnixTime(slot.endTime),
	})) || [];
  
	// Generate all possible 30-minute slots within the available time
	const allSlots = [];
	let currentSlot = availableFrom;
	while (isBefore(currentSlot, availableTill)) {
	  allSlots.push(currentSlot);
	  currentSlot = addMinutes(currentSlot, duration);
	}
  
	// Filter out busy slots and slots before the current time
	const freeSlots = allSlots.filter((slot) => {
	  const slotEnd = addMinutes(slot, duration);
	  
	  // Check if the slot is in the past
	  if (isBefore(slotEnd, now)) {
		return false;
	  }
	  
	  // Check if the slot overlaps with any busy slot
	  return !busySlots.some(
		(busySlot: { start: Date; end: Date }) =>
			(isAfter(slot, busySlot.start) && isBefore(slot, busySlot.end)) ||
			(isAfter(slotEnd, busySlot.start) && isBefore(slotEnd, busySlot.end))
	  );
	});
  
	return freeSlots;
  }
  
  export async function TimeSlots({
	selectedDate,
	userName,
	meetingDuration,
  }: iappProps) {
	const formattedDate = format(selectedDate, "yyyy-MM-dd");
	const { data, nylasCalendarData } = await getAvailability(
	  selectedDate,
	  userName
	);
  
	if (!data) {
	  return (
		<div className="flex flex-col items-center justify-center p-4">
		  <p className="text-lg font-medium">No availability found for this day</p>
		  <p className="text-sm text-muted-foreground">
			Please try another day or contact the host
		  </p>
		</div>
	  );
	}
  
	const availableSlots = calculateAvailableTimeSlots(
	  data,
	  nylasCalendarData,
	  formattedDate,
	  meetingDuration
	);
  
	return (
	  <div className="flex flex-col">
		<h2 className="text-lg font-medium mb-4">Available Time Slots</h2>
		<div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
		  {availableSlots.map((slot) => (
			<Link
			  key={slot.toISOString()}
			  href={`?date=${formattedDate}&time=${format(slot, "HH:mm")}`}
			>
			  <Button variant="outline" className="w-full text-sm">
				{format(slot, "h:mm a")}
			  </Button>
			</Link>
		  ))}
		</div>
	  </div>
	);
  }