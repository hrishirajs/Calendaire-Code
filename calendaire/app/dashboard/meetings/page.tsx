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
import { Calendar, Clock, Video, Users, X, Badge } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">
            Manage your upcoming and past meetings
          </p>
        </div>
      </div>

      {futureMeetings.length < 1 ? (
        <EmptyState
          title="No meetings found"
          description="You don't have any meetings yet."
          buttonText="Create a new event type"
          href="/dashboard/new"
        />
      ) : (
        <div className="grid gap-6">
          {futureMeetings.map((item) => {
            if (!item.when?.startTime || !item.when?.endTime) {
              return null;
            }

            const startTime = fromUnixTime(item.when.startTime);
            const endTime = fromUnixTime(item.when.endTime);
            const isToday = format(startTime, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{format(startTime, "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>You and {item.participants[0]?.name || "Guest"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isToday && (
                        <Badge fontVariant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          Today
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleCancel(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {item.conferencing?.details?.url && (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => window.open(item.conferencing?.details?.url, '_blank')}
                      >
                        <Video className="h-4 w-4" />
                        Join Meeting
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}