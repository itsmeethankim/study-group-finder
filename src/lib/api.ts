import type { ApiGroup, ApiMeResponse, User } from "./types";

function getFirstError(
  err: unknown
): string | undefined {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const obj = err as Record<string, unknown>;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (Array.isArray(val) && val[0]) return String(val[0]);
    }
  }
  return undefined;
}

export async function fetchGroups(): Promise<ApiGroup[]> {
  const res = await fetch("/api/groups", { credentials: "include" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to fetch groups");
  }
  return res.json();
}

export interface CreateGroupInput {
  title: string;
  course: string;
  location: string;
  startsAt: string;
  seats: number;
  description: string;
}

export async function createGroup(data: CreateGroupInput): Promise<ApiGroup> {
  const res = await fetch("/api/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) throw new Error("Please log in to create a group");
    const msg = getFirstError(json.error) ?? "Failed to create group";
    throw new Error(msg);
  }
  return json;
}

export async function login(
  email: string,
  password: string
): Promise<{ user: User }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = getFirstError(json.error) ?? "Login failed";
    throw new Error(msg);
  }
  return json;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<{ user: User }> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = getFirstError(json.error) ?? "Registration failed";
    throw new Error(msg);
  }
  return json;
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function fetchMe(): Promise<ApiMeResponse | null> {
  const res = await fetch("/api/me", { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}

export async function joinGroup(groupId: string): Promise<void> {
  const res = await fetch(`/api/groups/${groupId}/join`, {
    method: "POST",
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json.error ?? "Failed to join group";
    throw new Error(msg);
  }
}

export async function leaveGroup(groupId: string): Promise<void> {
  const res = await fetch(`/api/groups/${groupId}/leave`, {
    method: "POST",
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json.error ?? "Failed to leave group";
    throw new Error(msg);
  }
}

export async function deleteGroup(groupId: string): Promise<void> {
  const res = await fetch(`/api/groups/${groupId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json.error ?? "Failed to delete group";
    throw new Error(msg);
  }
}

export async function updateGroup(
  groupId: string,
  data: CreateGroupInput
): Promise<ApiGroup> {
  const res = await fetch(`/api/groups/${groupId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) throw new Error("Please log in to edit this group");
    if (res.status === 403) throw new Error("Only the creator can edit this group");
    const msg = getFirstError(json.error) ?? "Failed to update group";
    throw new Error(msg);
  }
  return json;
}
