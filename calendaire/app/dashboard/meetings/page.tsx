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
  status?: string;
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
    return eventDate > new Date() && item.status !== "cancelled";
  });

  const cancelledMeetings = meetings.filter((item) => {
    if (!item.when?.startTime) {
      return false;
    }
    
    if (!item.conferencing?.details?.url) {
      return false;
    }
    
    return item.status === "cancelled";
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
            <p className="text-muted-foreground text-lg">
              Manage your upcoming and past meetings
            </p>
          </div>
        </div>

        {/* Meeting Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Upcoming Meetings</h3>
                <p className="text-2xl font-bold">{futureMeetings.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-destructive/5 border-destructive/20">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Cancelled Meetings</h3>
                <p className="text-2xl font-bold">{cancelledMeetings.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <X className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-12">
          {/* Upcoming Meetings Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">Upcoming Meetings</h2>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {futureMeetings.length}
                </Badge>
              </div>
            </div>
            
            {futureMeetings.length < 1 ? (
              <EmptyState
                title="No upcoming meetings"
                description="You don't have any upcoming meetings."
                buttonText="Create a new event type"
                href="/dashboard/new"
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {futureMeetings.map((item) => {
                  if (!item.when?.startTime || !item.when?.endTime) {
                    return null;
                  }

                  const startTime = fromUnixTime(item.when.startTime);
                  const endTime = fromUnixTime(item.when.endTime);
                  const isToday = format(startTime, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                  return (
                    <Card key={item.id} className="overflow-hidden transition-all hover:shadow-lg border-2 hover:border-primary/20">
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{item.title}</h3>
                              {isToday && (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                  Today
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-1">
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
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleCancel(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {item.conferencing?.details?.url && (
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2 hover:bg-primary/5"
                            onClick={() => window.open(item.conferencing?.details?.url, '_blank')}
                          >
                            <Video className="h-4 w-4" />
                            Join Meeting
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cancelled Meetings Section */}
          {cancelledMeetings.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold">Cancelled Meetings</h2>
                  <Badge variant="outline" className="bg-destructive/10 text-destructive">
                    {cancelledMeetings.length}
                  </Badge>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cancelledMeetings.map((item) => {
                  if (!item.when?.startTime || !item.when?.endTime) {
                    return null;
                  }

                  const startTime = fromUnixTime(item.when.startTime);
                  const endTime = fromUnixTime(item.when.endTime);

                  return (
                    <Card key={item.id} className="overflow-hidden bg-muted/30 transition-all hover:shadow-lg border-2 border-dashed">
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-muted-foreground">{item.title}</h3>
                            </div>
                            <div className="space-y-1">
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
                          </div>
                          <Badge className="bg-destructive/10 text-destructive">Cancelled</Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}