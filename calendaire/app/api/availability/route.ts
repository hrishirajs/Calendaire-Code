import prisma from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userName = url.searchParams.get("userName");
    let day = url.searchParams.get("day");

    if (!userName || !day) {
      return Response.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Ensure the first letter is capitalized and the rest are lowercase
    // This matches the enum format in the Prisma schema
    day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

    // Fetch the user's availability for the specified day
    const availability = await prisma.availability.findFirst({
      where: {
        day: day as any, // TypeScript can't narrow the day enum type here
        User: {
          userName: userName,
        },
      },
      select: {
        fromTime: true,
        tillTime: true,
        isActive: true,
        // Include the hourly availability fields
        hour0to1: true,
        hour1to2: true,
        hour2to3: true,
        hour3to4: true,
        hour4to5: true,
        hour5to6: true,
        hour6to7: true,
        hour7to8: true,
        hour8to9: true,
        hour9to10: true,
        hour10to11: true,
        hour11to12: true,
        hour12to13: true,
        hour13to14: true,
        hour14to15: true,
        hour15to16: true,
        hour16to17: true,
        hour17to18: true,
        hour18to19: true,
        hour19to20: true,
        hour20to21: true,
        hour21to22: true,
        hour22to23: true,
        hour23to24: true,
      },
    });

    if (!availability) {
      return Response.json({ error: "Availability not found" }, { status: 404 });
    }

    return Response.json(availability);
  } catch (error) {
    console.error("Error fetching availability:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
} 