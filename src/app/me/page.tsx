"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMe } from "@/lib/api";
import type { ApiMeResponse } from "@/lib/types";
import GroupCard from "@/components/GroupCard";

export default function MePage() {
  const router = useRouter();
  const [data, setData] = useState<ApiMeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    fetchMe()
      .then((res) => {
        if (res) setData(res);
        else router.replace("/login");
      })
      .catch(() => setError("Failed to load your data"))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-zinc-900">My Dashboard</h1>
        <p className="mt-4 text-zinc-600">Loading...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-zinc-900">My Dashboard</h1>
        <p className="mt-4 text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { createdGroups, joinedGroups } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900">My Dashboard</h1>
      <p className="mt-2 text-zinc-600">
        Groups you created and groups you joined.
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-900">My Created Groups</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {createdGroups.length > 0 ? (
            createdGroups.map((group) => (
              <GroupCard key={group.id} group={group} onRefetch={refetch} />
            ))
          ) : (
            <p className="text-zinc-500">You haven&apos;t created any groups yet.</p>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-900">Joined Groups</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {joinedGroups.length > 0 ? (
            joinedGroups.map((group) => (
              <GroupCard key={group.id} group={group} onRefetch={refetch} />
            ))
          ) : (
            <p className="text-zinc-500">You haven&apos;t joined any groups yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
