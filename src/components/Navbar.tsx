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
    <nav className="glass-navbar fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-bold gradient-text">
          Study Group Finder
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/groups" className="nav-link text-sm">
            Groups
          </Link>
          <Link href="/groups/new" className="nav-link text-sm">
            Create
          </Link>
          <Link href="/me" className="nav-link text-sm">
            Dashboard
          </Link>
          {isLoggedIn === true ? (
            <button
              onClick={handleLogout}
              className="btn-secondary text-sm !py-2 !px-4"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="btn-primary text-sm !py-2 !px-4"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
