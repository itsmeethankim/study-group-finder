import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserIdFromCookie } from "@/lib/auth";

const updateGroupSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  course: z.string().min(1, "Course is required").optional(),
  location: z.string().min(1, "Location is required").optional(),
  startsAt: z.string().min(1, "Start time is required").optional(),
  seats: z.number().int().positive("Seats must be positive").optional(),
  description: z.string().min(1, "Description is required").optional(),
});

function formatGroup(g: {
  id: string;
  title: string;
  course: string;
  location: string;
  startsAt: Date;
  seats: number;
  description: string;
  createdAt: Date;
  creator: { name: string };
  _count: { memberships: number };
}) {
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
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserIdFromCookie();
    const { id: groupId } = await params;

    const group = await prisma.studyGroup.findUnique({
      where: { id: groupId },
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
    });
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    if (group.creatorId !== userId) {
      return NextResponse.json({ error: "Only the creator can edit this group" }, { status: 403 });
    }

    const gWithMembers = group as typeof group & { memberships?: { id: string }[] };
    const joinedByMe = (gWithMembers.memberships?.length ?? 0) > 0;
    return NextResponse.json({
      ...formatGroup(group),
      isCreator: true,
      joinedByMe,
    });
  } catch (err) {
    console.error("Fetch group error:", err);
    return NextResponse.json(
      { error: "Failed to fetch group" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId } = await params;

    const group = await prisma.studyGroup.findUnique({
      where: { id: groupId },
      include: {
        creator: { select: { name: true } },
        _count: { select: { memberships: true } },
      },
    });
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    if (group.creatorId !== userId) {
      return NextResponse.json({ error: "Only the creator can edit this group" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateGroupSchema.safeParse({
      ...body,
      seats: typeof body.seats === "string" ? parseInt(body.seats, 10) : body.seats,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.title != null) data.title = parsed.data.title;
    if (parsed.data.course != null) data.course = parsed.data.course;
    if (parsed.data.location != null) data.location = parsed.data.location;
    if (parsed.data.seats != null) data.seats = parsed.data.seats;
    if (parsed.data.description != null) data.description = parsed.data.description;

    if (parsed.data.startsAt != null) {
      const d = new Date(parsed.data.startsAt);
      if (isNaN(d.getTime())) {
        return NextResponse.json(
          { error: { startsAt: ["Invalid start date and time"] } },
          { status: 400 }
        );
      }
      data.startsAt = d;
    }

    const updated = await prisma.studyGroup.update({
      where: { id: groupId },
      data,
      include: {
        creator: { select: { name: true } },
        _count: { select: { memberships: true } },
      },
    });

    return NextResponse.json(formatGroup(updated));
  } catch (err) {
    console.error("Update group error:", err);
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId } = await params;

    const group = await prisma.studyGroup.findUnique({ where: { id: groupId } });
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    if (group.creatorId !== userId) {
      return NextResponse.json({ error: "Only the creator can delete this group" }, { status: 403 });
    }

    await prisma.studyGroup.delete({ where: { id: groupId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete group error:", err);
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
}
