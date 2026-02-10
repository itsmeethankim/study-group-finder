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

    const group = await prisma.studyGroup.findUnique({ where: { id: groupId } });
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    await prisma.membership.deleteMany({
      where: { userId, groupId },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Leave group error:", err);
    return NextResponse.json(
      { error: "Failed to leave group" },
      { status: 500 }
    );
  }
}
