import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserIdFromCookie } from "@/lib/auth";

const createGroupSchema = z.object({
  title: z.string().min(1, "Title is required"),
  course: z.string().min(1, "Course is required"),
  location: z.string().min(1, "Location is required"),
  startsAt: z.string().min(1, "Start time is required"),
  seats: z.number().int().positive("Seats must be positive"),
  description: z.string().min(1, "Description is required"),
});

export async function GET() {
  try {
    const userId = await getUserIdFromCookie();

    const groups = await prisma.studyGroup.findMany({
      include: {
        creator: { select: { name: true } },
        _count: { select: { memberships: true } },
        ...(userId
          ? {
              memberships: {
                where: { userId },
                select: { id: true },
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    const result = groups.map((g) => {
      const gWithMembers = g as typeof g & { memberships?: { id: string }[] };
      const joinedByMe = (gWithMembers.memberships?.length ?? 0) > 0;
      return {
        id: g.id,
        title: g.title,
        course: g.course,
        location: g.location,
        startsAt: g.startsAt.toISOString(),
        seats: g.seats,
        description: g.description,
        createdAt: g.createdAt.toISOString(),
        creatorName: g.creator.name,
        memberCount: g._count.memberships,
        joinedByMe,
        isCreator: userId ? g.creatorId === userId : false,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Fetch groups error:", err);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createGroupSchema.safeParse({
      ...body,
      startsAt: body.startsAt,
      seats: typeof body.seats === "string" ? parseInt(body.seats, 10) : body.seats,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, course, location, startsAt, seats, description } = parsed.data;

    const startsAtDate = new Date(startsAt);
    if (isNaN(startsAtDate.getTime())) {
      return NextResponse.json(
        { error: { startsAt: ["Invalid start date and time"] } },
        { status: 400 }
      );
    }

    const group = await prisma.studyGroup.create({
      data: {
        title,
        course,
        location,
        startsAt: startsAtDate,
        seats,
        description,
        creatorId: userId,
      },
      include: {
        creator: { select: { name: true } },
        _count: { select: { memberships: true } },
      },
    });

    return NextResponse.json({
      id: group.id,
      title: group.title,
      course: group.course,
      location: group.location,
      startsAt: group.startsAt.toISOString(),
      seats: group.seats,
      description: group.description,
      createdAt: group.createdAt.toISOString(),
      creatorName: group.creator.name,
      memberCount: group._count.memberships,
    });
  } catch (err) {
    console.error("Create group error:", err);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
