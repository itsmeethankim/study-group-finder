"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/lib/api";

export default function Navbar() {
  const { isLoggedIn, setLoggedIn } = useAuth();

  async function handleLogout() {
    await logout();
    setLoggedIn(false);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          Study Group Finder
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/groups"
            className="text-zinc-600 transition hover:text-zinc-900"
          >
            Groups
          </Link>
          <Link
            href="/groups/new"
            className="text-zinc-600 transition hover:text-zinc-900"
          >
            Create
          </Link>
          <Link
            href="/me"
            className="text-zinc-600 transition hover:text-zinc-900"
          >
            Me
          </Link>
          {isLoggedIn === true ? (
            <button
              onClick={handleLogout}
              className="text-zinc-600 transition hover:text-zinc-900"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="text-zinc-600 transition hover:text-zinc-900"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
