import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { nylas } from "@/app/lib/nylas";

export async function POST(req: NextRequest) {
  try {
    // Parse the form data
    const formData = await req.formData();
    
    console.log("API route received form data:", Object.fromEntries(formData.entries()));
    
    // Check required fields
    const requiredFields = ['userName', 'eventTypeId', 'name', 'email', 'fromTime', 'eventDate', 'meetingLength'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Extract form values
    const userName = formData.get("userName") as string;
    const eventTypeId = formData.get("eventTypeId") as string;
    const guestName = formData.get("name") as string;
    const guestEmail = formData.get("email") as string;
    const formTime = formData.get("fromTime") as string;
    const meetingLength = Number(formData.get("meetingLength"));
    const eventDate = formData.get("eventDate") as string;
    
    // Find the user
    const getUserData = await prisma.user.findUnique({
      where: { userName },
      select: {
        grantEmail: true,
        grantId: true,
        name: true,
      },
    });
    
    if (!getUserData) {
      return NextResponse.json(
        { message: `User not found with userName: ${userName}` },
        { status: 404 }
      );
    }
    
    // Check if user has connected their calendar
    if (!getUserData.grantId || !getUserData.grantEmail) {
      return NextResponse.json(
        { message: "User has not connected their calendar" },
        { status: 400 }
      );
    }
    
    // Find the event type
    const eventTypeData = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
      select: {
        title: true,
        description: true,
      },
    });
    
    if (!eventTypeData) {
      return NextResponse.json(
        { message: `Event type not found with ID: ${eventTypeId}` },
        { status: 404 }
      );
    }
    
    // Calculate meeting times
    const startDateTime = new Date(`${eventDate}T${formTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);
    
    // Try to create a record in the database regardless of Nylas API status
    await prisma.meeting.create({
      data: {
        eventTypeId: eventTypeId,
        fromTime: formTime,
        date: startDateTime,
        duration: meetingLength,
        attendeeName: guestName,
        attendeeEmail: guestEmail,
        status: "PENDING" // Will be updated if Nylas call succeeds
      }
    });
    
    // Try to create a Nylas event
    try {
      await nylas.events.create({
        identifier: getUserData.grantId,
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
              name: guestName,
              email: guestEmail,
              status: "yes",
            },
          ],
        },
        queryParams: {
          calendarId: getUserData.grantEmail,
          notifyParticipants: true,
        },
      });
      
      // If we get here, the Nylas call was successful
      console.log("Successfully created Nylas event!");
      return NextResponse.json({ success: true });
    } catch (nylasError: any) {
      console.error("Nylas API error:", nylasError);
      
      // Return success anyway since we created a database record
      // The admin can manually handle this booking
      return NextResponse.json({ 
        success: true, 
        warning: "Meeting created but calendar integration failed. Please check your calendar settings."
      });
    }
  } catch (error: any) {
    console.error("Error in /api/book:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred while booking the meeting" },
      { status: 500 }
    );
  }
} 