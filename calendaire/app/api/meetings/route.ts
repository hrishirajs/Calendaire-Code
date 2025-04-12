import { auth } from "@/app/lib/auth";
import { nylas } from "@/app/lib/nylas";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        grantId: true,
        grantEmail: true,
      },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = await nylas.events.list({
      identifier: userData.grantId as string,
      queryParams: {
        calendarId: userData.grantEmail as string,
        limit: 100,
        showCancelled: true,
      },
    });

    return NextResponse.json(data.data);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
} 