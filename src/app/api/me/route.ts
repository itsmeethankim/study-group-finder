import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [createdGroupsRaw, memberships] = await Promise.all([
      prisma.studyGroup.findMany({
        where: { creatorId: userId },
        include: {
          creator: { select: { name: true } },
          _count: { select: { memberships: true } },
          memberships: { where: { userId }, select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.membership.findMany({
        where: { userId },
        include: {
          group: {
            include: {
              creator: { select: { name: true } },
              _count: { select: { memberships: true } },
            },
          },
        },
      }),
    ]);

    const formatGroup = (
      g: {
        id: string;
        title: string;
        course: string;
        location: string;
        startsAt: Date;
        seats: number;
        description: string;
        createdAt: Date;
        creator?: { name: string };
        _count?: { memberships: number };
      },
      opts: { isCreator: boolean; joinedByMe: boolean }
    ) => ({
      id: g.id,
      title: g.title,
      course: g.course,
      location: g.location,
      startsAt: g.startsAt.toISOString(),
      seats: g.seats,
      description: g.description,
      createdAt: g.createdAt.toISOString(),
      creatorName: g.creator?.name,
      memberCount: g._count?.memberships ?? 0,
      isCreator: opts.isCreator,
      joinedByMe: opts.joinedByMe,
    });

    const createdGroups = createdGroupsRaw.map((g) =>
      formatGroup(g, {
        isCreator: true,
        joinedByMe: (g.memberships?.length ?? 0) > 0,
      })
    );
    const joinedGroups = memberships.map((m) =>
      formatGroup(m.group, { isCreator: false, joinedByMe: true })
    );

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      },
      createdGroups,
      joinedGroups,
    });
  } catch (err) {
    console.error("Fetch me error:", err);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
