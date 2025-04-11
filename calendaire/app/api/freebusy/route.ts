import { nylas } from "@/app/lib/nylas";
import { NextRequest } from 'next/server';
import prisma from '../../../lib/prisma';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

interface BusySlot {
  start_time: number;
  end_time: number;
  status: string;
}

interface FreeBusyResponse {
  data: Array<{
    email: string;
    timeSlots: Array<{
      status: string;
      startTime: number;
      endTime: number;
    }>;
  }>;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userName = url.searchParams.get('userName');
    const date = url.searchParams.get('date');
    const timeZone = req.headers.get('x-timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone;

    console.log('Fetching free/busy data for:', { userName, date, timeZone });

    if (!userName || !date) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Get user's grantId and grantEmail
    const user = await prisma.user.findUnique({
      where: { userName },
      select: { grantId: true, grantEmail: true }
    });

    if (!user || !user.grantId || !user.grantEmail) {
      return Response.json({ error: 'User not found or calendar not connected' }, { status: 404 });
    }

    console.log('Found user:', { grantId: user.grantId, grantEmail: user.grantEmail });

    // Convert date string to Date object
    const localDate = parseISO(date);
    const startTime = startOfDay(localDate);
    const endTime = endOfDay(localDate);

    // Convert to Unix timestamps for Nylas
    const startUnix = Math.floor(startTime.getTime() / 1000);
    const endUnix = Math.floor(endTime.getTime() / 1000);

    console.log('Time range:', {
      date,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      startUnix,
      endUnix
    });

    try {
      const freeBusyResponse = await nylas.calendars.getFreeBusy({
        identifier: user.grantId,
        requestBody: {
          startTime: startUnix,
          endTime: endUnix,
          emails: [user.grantEmail],
        },
      }) as unknown as FreeBusyResponse;

      console.log('Raw Nylas response:', JSON.stringify(freeBusyResponse, null, 2));

      if (!freeBusyResponse.data || !Array.isArray(freeBusyResponse.data)) {
        console.error('Invalid response format from Nylas:', freeBusyResponse);
        throw new Error('Invalid response format from Nylas');
      }

      // Convert Nylas timeSlots format to our BusySlot format
      const busySlots: BusySlot[] = (freeBusyResponse.data[0]?.timeSlots || []).map(slot => ({
        start_time: slot.startTime,
        end_time: slot.endTime,
        status: slot.status
      }));
      
      // Log busy slots with readable times
      console.log('Busy slots:', busySlots.map(slot => ({
        start: new Date(slot.start_time * 1000).toLocaleString(),
        end: new Date(slot.end_time * 1000).toLocaleString(),
        status: slot.status,
        unix: {
          start: slot.start_time,
          end: slot.end_time
        }
      })));

      return Response.json(busySlots);
    } catch (nylasError: any) {
      console.error('Nylas API error:', nylasError);
      return Response.json({ 
        error: 'Nylas API error', 
        details: nylasError.message,
        response: nylasError.response?.body 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error fetching free/busy data:', error);
    return Response.json({ 
      error: 'Failed to fetch free/busy data',
      details: error.message
    }, { status: 500 });
  }
} 