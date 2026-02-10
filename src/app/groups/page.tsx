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
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-zinc-900">Study Groups</h1>
        <p className="mt-4 text-red-600">{error}</p>
      </div>
    );
  }

  if (groups === null) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-zinc-900">Study Groups</h1>
        <p className="mt-4 text-zinc-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900">Study Groups</h1>
      <p className="mt-2 text-zinc-600">
        Browse study groups or create your own.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.length === 0 ? (
          <p className="col-span-full text-zinc-500">No groups yet. Create the first one!</p>
        ) : (
          groups.map((group) => (
            <GroupCard key={group.id} group={group} onRefetch={refetch} />
          ))
        )}
      </div>
    </div>
  );
}
