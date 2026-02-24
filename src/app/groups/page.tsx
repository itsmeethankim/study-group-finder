"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchGroups } from "@/lib/api";
import type { ApiGroup } from "@/lib/types";
import GroupCard from "@/components/GroupCard";

export default function GroupsPage() {
  const [groups, setGroups] = useState<ApiGroup[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    fetchGroups()
      .then(setGroups)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load groups"));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold section-title" style={{ color: 'var(--text-primary)' }}>Study Groups</h1>
        <p className="mt-6 alert-error">{error}</p>
      </div>
    );
  }

  if (groups === null) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold section-title" style={{ color: 'var(--text-primary)' }}>Study Groups</h1>
        <p className="mt-6" style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 animate-fade-in">
      <h1 className="text-3xl font-bold section-title" style={{ color: 'var(--text-primary)' }}>
        Study Groups
      </h1>
      <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
        Browse study groups or create your own.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.length === 0 ? (
          <div className="col-span-full glass-card p-8 text-center">
            <p style={{ color: 'var(--text-muted)' }}>No groups yet. Be the first to create one!</p>
          </div>
        ) : (
          groups.map((group) => (
            <GroupCard key={group.id} group={group} onRefetch={refetch} />
          ))
        )}
      </div>
    </div>
  );
}
