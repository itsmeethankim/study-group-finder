"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { updateGroup } from "@/lib/api";
import type { ApiGroup } from "@/lib/types";

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditGroupPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [group, setGroup] = useState<ApiGroup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/groups/${id}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) router.replace("/groups");
          else throw new Error("Failed to load group");
          return;
        }
        return res.json();
      })
      .then(setGroup)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const course = formData.get("course") as string;
    const location = formData.get("location") as string;
    const startsAtRaw = formData.get("startsAt") as string;
    const seats = parseInt(formData.get("seats") as string, 10);
    const description = formData.get("description") as string;

    if (!startsAtRaw || isNaN(new Date(startsAtRaw).getTime())) {
      setError("Please enter a valid start date and time");
      return;
    }
    const startsAt = new Date(startsAtRaw).toISOString();

    setIsSubmitting(true);
    try {
      await updateGroup(id, { title, course, location, startsAt, seats, description });
      router.push("/groups");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update group");
      setIsSubmitting(false);
    }
  }

  if (error && !group) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="glass-card p-8 text-center">
          <p className="alert-error">{error}</p>
          <Link href="/groups" className="mt-4 inline-block text-sm font-medium gradient-text hover:underline">
            Back to groups
          </Link>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Edit study group
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Update your group details.
          </p>
          {error && (
            <p className="mt-4 alert-error">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                defaultValue={group.title}
                className="input-dark"
                placeholder="e.g. CS 101 Study Group"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="course" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Course
                </label>
                <input
                  id="course"
                  name="course"
                  type="text"
                  required
                  defaultValue={group.course}
                  className="input-dark"
                  placeholder="e.g. CS 101"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="seats" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Seats
                </label>
                <input
                  id="seats"
                  name="seats"
                  type="number"
                  min={1}
                  required
                  defaultValue={group.seats}
                  className="input-dark"
                  placeholder="10"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="location" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                defaultValue={group.location}
                className="input-dark"
                placeholder="e.g. Library Room 201"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="startsAt" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Start time
              </label>
              <input
                id="startsAt"
                name="startsAt"
                type="datetime-local"
                required
                defaultValue={toDatetimeLocal(group.startsAt)}
                className="input-dark"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                defaultValue={group.description}
                className="input-dark"
                placeholder="What will you study? When do you meet?"
              />
            </div>
            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1"
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>
              <Link
                href="/groups"
                className="btn-secondary flex-1 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
