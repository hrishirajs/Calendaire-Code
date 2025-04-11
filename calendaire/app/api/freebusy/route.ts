import { nylas } from '../../../lib/nylas';
import { NextRequest } from 'next/server';
import prisma from '../../../lib/prisma';

interface BusySlot {
  start_time: number;
  end_time: number;
  status: string;
}

interface FreeBusyResponse {
  data: Array<{
    email: string;
    time_slots: BusySlot[];
  }>;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userName = url.searchParams.get('userName');
    const date = url.searchParams.get('date');

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

    // Get free/busy data from Nylas
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const freeBusyResponse = await nylas.calendars.getFreeBusy({
      identifier: user.grantId,
      requestBody: {
        startTime: Math.floor(startOfDay.getTime() / 1000),
        endTime: Math.floor(endOfDay.getTime() / 1000),
        emails: [user.grantEmail],
      },
    }) as unknown as FreeBusyResponse;

    return Response.json(freeBusyResponse.data[0]?.time_slots || []);
  } catch (error) {
    console.error('Error fetching free/busy data:', error);
    return Response.json({ error: 'Failed to fetch free/busy data' }, { status: 500 });
  }
} 