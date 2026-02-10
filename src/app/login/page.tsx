"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { setLoggedIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      setLoggedIn(true);
      router.push("/groups");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-zinc-900">Log in</h1>
      <p className="mt-2 text-zinc-600">
        Sign in to create and join study groups.
      </p>
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-lg border border-zinc-300 px-4 py-2 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            placeholder="you@example.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-zinc-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="rounded-lg border border-zinc-300 px-4 py-2 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-600">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-zinc-900 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
