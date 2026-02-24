"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { register } from "@/lib/api";

export default function RegisterPage() {
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
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await register(name, email, password);
      setLoggedIn(true);
      router.push("/groups");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Create an account
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Register to create and join study groups.
          </p>
          {error && (
            <p className="mt-4 alert-error">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-dark"
                placeholder="Your name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-dark"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-dark"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary mt-2"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{" "}
            <Link href="/login" className="font-medium gradient-text hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
