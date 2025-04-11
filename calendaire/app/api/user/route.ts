import prisma from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userName = url.searchParams.get("userName");

    if (!userName) {
      return Response.json({ error: "Missing userName parameter" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        userName: userName,
      },
      select: {
        grantId: true,
        grantEmail: true,
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
} 