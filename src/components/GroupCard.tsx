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
  const fillPercent = Math.min((group.memberCount / group.seats) * 100, 100);

  return (
    <article className="glass-card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
          {group.title}
        </h3>
        <span className="badge shrink-0">{group.course}</span>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {group.description}
      </p>

      {/* Member bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>{group.memberCount}/{group.seats} members</span>
          {isFull && (
            <span className="text-xs font-medium" style={{ color: '#f87171' }}>Full</span>
          )}
        </div>
        <div className="member-bar">
          <div
            className="member-bar-fill"
            style={{ width: `${fillPercent}%` }}
          />
        </div>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
        {group.location && (
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {group.location}
          </span>
        )}
        {group.startsAt && (
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            {new Date(group.startsAt).toLocaleString()}
          </span>
        )}
      </div>

      {error && (
        <p className="alert-error">{error}</p>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        {showJoinLeave && canJoin && (
          <button
            type="button"
            onClick={handleJoin}
            disabled={loading !== null}
            className="btn-primary text-sm !py-2 !px-4"
          >
            {loading === "join" ? "Joining..." : "Join"}
          </button>
        )}
        {showJoinLeave && group.joinedByMe && !isCreator && (
          <button
            type="button"
            onClick={handleLeave}
            disabled={loading !== null}
            className="btn-secondary text-sm !py-2 !px-4"
          >
            {loading === "leave" ? "Leaving..." : "Leave"}
          </button>
        )}
        {isCreator && (
          <>
            <Link
              href={`/groups/${group.id}/edit`}
              className="btn-secondary text-sm !py-2 !px-4 inline-flex items-center"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading !== null}
              className="btn-danger text-sm !py-2 !px-4"
            >
              {loading === "delete" ? "Deleting..." : "Delete"}
            </button>
          </>
        )}
      </div>
    </article>
  );
}
