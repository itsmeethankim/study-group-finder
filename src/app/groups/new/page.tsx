"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGroup } from "@/lib/api";

export default function NewGroupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await createGroup({ title, course, location, startsAt, seats, description });
      router.push("/groups");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Create a study group
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Set up a new group for your class or subject.
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
                className="input-dark"
                placeholder="What will you study? When do you meet?"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary mt-2"
            >
              {isSubmitting ? "Creating..." : "Create group"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
