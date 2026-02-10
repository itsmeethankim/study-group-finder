import { cookies } from "next/headers";

const COOKIE_NAME = "sgf_user";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function setUserCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearUserCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getUserIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  return cookie?.value ?? null;
}
