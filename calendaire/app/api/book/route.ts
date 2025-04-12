import { nylas } from "@/app/lib/nylas";
import { NextRequest } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Extract form data
    const userName = formData.get("userName") as string;
    const eventTypeId = formData.get("eventTypeId") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const fromTime = formData.get("fromTime") as string;
    const eventDate = formData.get("eventDate") as string;
    const meetingLength = Number(formData.get("meetingLength"));

    // Validate required fields
    if (!userName || !eventTypeId || !name || !email || !fromTime || !eventDate || !meetingLength) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user data
    const userData = await prisma.user.findUnique({
      where: {
        userName,
      },
      select: {
        grantEmail: true,
        grantId: true,
        name: true,
      },
    });

    if (!userData) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (!userData.grantId || !userData.grantEmail) {
      return Response.json(
        { message: "User has not connected their calendar" },
        { status: 400 }
      );
    }

    // Get event type data
    const eventTypeData = await prisma.eventType.findUnique({
      where: {
        id: eventTypeId,
      },
      select: {
        title: true,
        description: true,
      },
    });

    if (!eventTypeData) {
      return Response.json(
        { message: "Event type not found" },
        { status: 404 }
      );
    }

    // Create date objects for the meeting
    const startDateTime = new Date(`${eventDate}T${fromTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);

    // Create event with Nylas
    const nylasEvent = await nylas.events.create({
      identifier: userData.grantId,
      requestBody: {
        title: eventTypeData.title,
        description: eventTypeData.description,
        when: {
          startTime: Math.floor(startDateTime.getTime() / 1000),
          endTime: Math.floor(endDateTime.getTime() / 1000),
        },
        conferencing: {
          autocreate: {},
          provider: "Google Meet",
        },
        participants: [
          {
            name: name,
            email: email,
            status: "yes",
          },
        ],
      },
      queryParams: {
        calendarId: userData.grantEmail,
        notifyParticipants: true,
      },
    });

    // Create meeting record in database
    await prisma.meeting.create({
      data: {
        eventTypeId,
        fromTime,
        date: startDateTime,
        duration: meetingLength,
        attendeeName: name,
        attendeeEmail: email,
        status: "SCHEDULED",
        nylasEventId: nylasEvent.data.id
      }
    });

    return Response.json({ message: "Meeting scheduled successfully" });
  } catch (error: any) {
    console.error("Error in /api/book:", error);
    return Response.json(
      { message: error.message || "Failed to schedule meeting" },
      { status: 500 }
    );
  }
} 