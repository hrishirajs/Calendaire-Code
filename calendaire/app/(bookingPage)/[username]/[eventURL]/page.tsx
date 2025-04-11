import { createMeetingAction, createMeetingFallback } from "@/app/actions";
import { RenderCalendar } from "@/app/components/bookingForm/RenderCalendar";
import { SubmitButton } from "@/app/components/SubmitButton";
import { TimeSlots } from "@/app/components/TimeSlots";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { format, isSameDay } from "date-fns";
import { BookMarked, CalendarCheck, CalendarX2, Clock, AlertCircle, ChevronRight } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { DebugFormData } from "@/app/components/DebugFormData";
import { BookingForm } from "@/app/components/bookingForm/BookingForm";

async function getData(username: string, eventName: string) {
  const eventType = await prisma.eventType.findFirst({
    where: {
      url: eventName,
      User: {
        userName: username,
      },
      active: true,
    },
    select: {
      id: true,
      description: true,
      title: true,
      duration: true,
      videoCallSoftware: true,
      User: {
        select: {
          image: true,
          name: true,
          availability: {
            select: {
              day: true,
              isActive: true,
            },
          },
        },
      },
    },
  });

  if (!eventType) {
    return notFound();
  }

  return eventType;
}

// @ts-ignore - Next.js page props type issue
const BookingPage = async ({
  params,
  searchParams,
}: {
  params: { username: string; eventURL: string };
  searchParams: { date?: string; time?: string };
}) => {
  const { username, eventURL } = await params;
  const { date, time } = await searchParams;
  
  const selectedDate = date
    ? new Date(date)
    : new Date();
  const eventType = await getData(username, eventURL);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(selectedDate);

  const showForm = !!date && !!time;
  const isToday = isSameDay(selectedDate, new Date());

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:to-slate-950 flex items-center justify-center p-4 py-10">
      <DebugFormData />
      
      {showForm ? (
        <Card className="max-w-[900px] w-full shadow-lg border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-5 fade-in-50 duration-500">
          <div className="bg-primary/5 dark:bg-primary/10 p-4 border-b border-primary/10 dark:border-primary/20">
            <h1 className="text-2xl font-bold text-center">Complete Your Booking</h1>
          </div>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] lg:grid-cols-[1.2fr,auto,1fr] gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Image
                    src={eventType.User?.image as string}
                    alt={`${eventType.User?.name}'s profile picture`}
                    className="size-12 rounded-full ring-2 ring-primary/20"
                    width={48}
                    height={48}
                    unoptimized
                  />
                  <span className="absolute -bottom-1 -right-1 bg-green-500 size-3 rounded-full border-2 border-background"></span>
                </div>
                <div>
                  <p className="font-medium text-lg">{eventType.User?.name}</p>
                  <p className="text-sm text-muted-foreground">{eventType.title}</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground italic border-l-2 border-primary/20 pl-3">
                {eventType.description}
              </p>

              <div className="mt-5 grid gap-y-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CalendarX2 className="size-5 mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{formattedDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="size-5 mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">{time}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="size-5 mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{eventType.duration} minutes</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <BookMarked className="size-5 mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Meeting Platform</p>
                    <p className="text-sm text-muted-foreground">{eventType.videoCallSoftware || "Google Meet"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator
              orientation="vertical"
              className="hidden md:block h-full w-[1px]"
            />

            <BookingForm
              eventTypeId={eventType.id}
              userName={username}
              time={time as string}
              date={date as string}
              duration={eventType.duration}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-[1000px] mx-auto shadow-lg border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-5 fade-in-50 duration-500">
          <div className="bg-primary/5 dark:bg-primary/10 p-4 border-b border-primary/10 dark:border-primary/20">
            <h1 className="text-2xl font-bold text-center">Schedule Your Meeting</h1>
          </div>
          
          {/* Mobile Step Indicator - Only visible on small screens */}
          <div className="flex justify-center items-center gap-2 mt-4 px-4 md:hidden">
            <div className="flex flex-col items-center">
              <div className="size-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <span className="text-xs font-medium mt-1">Info</span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
            <div className="flex flex-col items-center">
              <div className="size-8 bg-primary/10 rounded-full flex items-center justify-center text-muted-foreground text-sm">2</div>
              <span className="text-xs font-medium mt-1">Date</span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
            <div className="flex flex-col items-center">
              <div className="size-8 bg-primary/10 rounded-full flex items-center justify-center text-muted-foreground text-sm">3</div>
              <span className="text-xs font-medium mt-1">Time</span>
            </div>
          </div>
          
          <CardContent className="p-6 grid-cols-1 md:grid md:grid-cols-[1fr,auto,1fr,auto,1fr] md:gap-6 space-y-8 md:space-y-0">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Image
                    src={eventType.User?.image as string}
                    alt={`${eventType.User?.name}'s profile picture`}
                    className="size-12 rounded-full ring-2 ring-primary/20"
                    width={48}
                    height={48}
                    unoptimized
                  />
                  <span className="absolute -bottom-1 -right-1 bg-green-500 size-3 rounded-full border-2 border-background"></span>
                </div>
                <div>
                  <p className="font-medium text-lg">{eventType.User?.name}</p>
                  <p className="text-sm text-muted-foreground">{eventType.title}</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground italic border-l-2 border-primary/20 pl-3">
                {eventType.description || "Book a meeting with me"}
              </p>

              <div className="mt-3 grid gap-y-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Clock className="size-5 mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{eventType.duration} minutes</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <BookMarked className="size-5 mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Meeting Platform</p>
                    <p className="text-sm text-muted-foreground">{eventType.videoCallSoftware || "Google Meet"}</p>
                  </div>
                </div>
              </div>
              
              {isToday && (
                <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/50">
                  <p className="text-xs text-amber-800 dark:text-amber-300 flex items-center">
                    <AlertCircle className="size-3.5 mr-1.5 text-amber-600 dark:text-amber-400" />
                    Today's time slots will only show times in the future (with a 30-minute buffer)
                  </p>
                </div>
              )}
              
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-100 dark:border-green-900">
                <p className="text-xs text-green-800 dark:text-green-300 flex items-center">
                  <CalendarCheck className="size-3.5 mr-1.5 text-green-600 dark:text-green-400" />
                  Select a date and time that works for you
                </p>
              </div>
            </div>

            <Separator
              orientation="vertical"
              className="hidden md:block h-full w-[1px]"
            />

            <div className="my-2 md:my-0">
              <h2 className="text-lg font-medium mb-4 text-center md:text-left flex items-center justify-center md:justify-start">
                <CalendarX2 className="size-4 mr-2 text-primary" />
                Select a Date
              </h2>
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-sm border border-border/40">
                <RenderCalendar daysofWeek={eventType.User?.availability || []} />
              </div>
            </div>

            <Separator
              orientation="vertical"
              className="hidden md:block h-full w-[1px]"
            />

            <TimeSlots
              selectedDate={selectedDate}
              userName={username}
              meetingDuration={eventType.duration}
            />
          </CardContent>
          <div className="px-6 pb-4 text-xs text-muted-foreground">
            <p className="flex items-center justify-center md:justify-start">
              <CalendarCheck className="size-3.5 mr-1.5 text-blue-500" />
              Time slots are based on the host's configured availability
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BookingPage;
