"use client";

import { cancelMeetingAction } from "@/app/actions";
import { EmptyState } from "@/app/components/EmptyState";
import { SubmitButton } from "@/app/components/SubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format, fromUnixTime } from "date-fns";
import { Video } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface NylasEvent {
  id: string;
  title: string;
  when: {
    startTimezone: string;
    endTimezone: string;
    object: string;
    startTime: number;
    endTime: number;
  };
  conferencing?: {
    provider: string;
    details: {
      meetingCode: string;
      url: string;
    };
  };
  participants: Array<{
    name: string;
    email: string;
    status: string;
  }>;
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<NylasEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMeetings() {
      try {
        const response = await fetch('/api/meetings');
        if (!response.ok) {
          throw new Error('Failed to load meetings');
        }
        const data = await response.json();
        setMeetings(data);
      } catch (error) {
        console.error('Error loading meetings:', error);
        toast.error('Failed to load meetings');
      } finally {
        setIsLoading(false);
      }
    }

    loadMeetings();
  }, []);

  const handleCancel = async (eventId: string) => {
    try {
      const formData = new FormData();
      formData.append('eventId', eventId);
      
      const result = await cancelMeetingAction(formData);
      if (result.success) {
        toast.success("Meeting cancelled successfully");
        // Refresh meetings list
        const response = await fetch('/api/meetings');
        if (response.ok) {
          const data = await response.json();
          setMeetings(data);
        }
      } else {
        toast.error(result.error || "Failed to cancel meeting");
      }
    } catch (error) {
      console.error('Error cancelling meeting:', error);
      toast.error('Failed to cancel meeting');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Filter for future events that have conferencing details (meetings)
  const futureMeetings = meetings.filter((item) => {
    if (!item.when?.startTime) {
      return false;
    }
    
    if (!item.conferencing?.details?.url) {
      return false;
    }
    
    const eventDate = fromUnixTime(item.when.startTime);
    return eventDate > new Date();
  });

  return (
    <>
      {futureMeetings.length < 1 ? (
        <EmptyState
          title="No meetings found"
          description="You don't have any meetings yet."
          buttonText="Create a new event type"
          href="/dashboard/new"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>
              See upcoming and past events booked through your event type links.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {futureMeetings.map((item) => {
              if (!item.when?.startTime || !item.when?.endTime) {
                return null;
              }

              return (
                <div key={item.id}>
                  <div className="grid grid-cols-3 justify-between items-center">
                    <div>
                      <p className="text-muted-foreground text-sm">
                        {format(fromUnixTime(item.when.startTime), "EEE, dd MMM")}
                      </p>
                      <p className="text-muted-foreground text-xs pt-1">
                        {format(fromUnixTime(item.when.startTime), "hh:mm a")} -{" "}
                        {format(fromUnixTime(item.when.endTime), "hh:mm a")}
                      </p>
                      {item.conferencing?.details?.url && (
                        <div className="flex items-center mt-1">
                          <Video className="size-4 mr-2 text-primary" />{" "}
                          <a
                            className="text-xs text-primary underline underline-offset-4"
                            target="_blank"
                            href={item.conferencing.details.url}
                          >
                            Join Meeting
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <h2 className="text-sm font-medium">{item.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        You and {item.participants[0]?.name || "Guest"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCancel(item.id)}
                      className="w-fit flex ml-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md text-sm"
                    >
                      Cancel Event
                    </button>
                  </div>
                  <Separator className="my-3" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </>
  );
}