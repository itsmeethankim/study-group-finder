import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromCookie } from "@/lib/auth";

export async function POST(
  _request: Request,
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
      include: { _count: { select: { memberships: true } } },
    });
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    if (group._count.memberships >= group.seats) {
      return NextResponse.json(
        { error: "Group is full" },
        { status: 400 }
      );
    }

    try {
      await prisma.membership.create({
        data: { userId, groupId },
      });
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        err.code === "P2002"
      ) {
        return NextResponse.json(
          { error: "Already joined this group" },
          { status: 400 }
        );
      }
      throw err;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Join group error:", err);
    return NextResponse.json(
      { error: "Failed to join group" },
      { status: 500 }
    );
  }
}
