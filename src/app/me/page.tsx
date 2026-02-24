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
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold section-title" style={{ color: 'var(--text-primary)' }}>My Dashboard</h1>
        <p className="mt-6" style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold section-title" style={{ color: 'var(--text-primary)' }}>My Dashboard</h1>
        <p className="mt-6 alert-error">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { createdGroups, joinedGroups } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 animate-fade-in">
      <h1 className="text-3xl font-bold section-title" style={{ color: 'var(--text-primary)' }}>
        My Dashboard
      </h1>
      <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
        Groups you created and groups you joined.
      </p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold section-title" style={{ color: 'var(--text-primary)' }}>
          My Created Groups
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {createdGroups.length > 0 ? (
            createdGroups.map((group) => (
              <GroupCard key={group.id} group={group} onRefetch={refetch} />
            ))
          ) : (
            <div className="col-span-full glass-card p-6 text-center">
              <p style={{ color: 'var(--text-muted)' }}>You haven&apos;t created any groups yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold section-title" style={{ color: 'var(--text-primary)' }}>
          Joined Groups
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {joinedGroups.length > 0 ? (
            joinedGroups.map((group) => (
              <GroupCard key={group.id} group={group} onRefetch={refetch} />
            ))
          ) : (
            <div className="col-span-full glass-card p-6 text-center">
              <p style={{ color: 'var(--text-muted)' }}>You haven&apos;t joined any groups yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
