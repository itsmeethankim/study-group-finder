"use client";

import { useState } from "react";
import Link from "next/link";
import type { ApiGroup } from "@/lib/types";
import { joinGroup, leaveGroup, deleteGroup } from "@/lib/api";

interface GroupCardProps {
  group: ApiGroup;
  onRefetch?: () => void;
}

export default function GroupCard({ group, onRefetch }: GroupCardProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refetch = () => {
    onRefetch?.();
  };

  async function handleJoin() {
    setError(null);
    setLoading("join");
    try {
      await joinGroup(group.id);
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join");
    } finally {
      setLoading(null);
    }
  }

  async function handleLeave() {
    setError(null);
    setLoading("leave");
    try {
      await leaveGroup(group.id);
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to leave");
    } finally {
      setLoading(null);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this group? This cannot be undone.")) return;
    setError(null);
    setLoading("delete");
    try {
      await deleteGroup(group.id);
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setLoading(null);
    }
  }

  const isFull = group.memberCount >= group.seats;
  const canJoin = !group.joinedByMe && !isFull;
  const showJoinLeave = group.joinedByMe !== undefined;
  const isCreator = group.isCreator ?? false;

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300 hover:shadow">
      <h3 className="font-semibold text-zinc-900">{group.title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{group.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <span className="rounded bg-zinc-100 px-2 py-0.5">{group.course}</span>
        <span>
          {group.memberCount}/{group.seats} members
        </span>
        {group.location && <span>{group.location}</span>}
        {group.startsAt && (
          <span>{new Date(group.startsAt).toLocaleString()}</span>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {showJoinLeave && canJoin && (
          <button
            type="button"
            onClick={handleJoin}
            disabled={loading !== null}
            className="rounded bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading === "join" ? "Joining..." : "Join"}
          </button>
        )}
        {showJoinLeave && group.joinedByMe && !isCreator && (
          <button
            type="button"
            onClick={handleLeave}
            disabled={loading !== null}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          >
            {loading === "leave" ? "Leaving..." : "Leave"}
          </button>
        )}
        {isCreator && (
          <>
            <Link
              href={`/groups/${group.id}/edit`}
              className="rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading !== null}
              className="rounded border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {loading === "delete" ? "Deleting..." : "Delete"}
            </button>
          </>
        )}
      </div>
    </article>
  );
}
