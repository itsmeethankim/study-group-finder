import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 overflow-hidden">
      {/* Decorative orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="relative z-10 max-w-3xl text-center animate-fade-in">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl gradient-text leading-tight">
          Find Your Study Group
        </h1>
        <p className="mt-6 text-lg sm:text-xl leading-relaxed animate-fade-in-delay" style={{ color: 'var(--text-secondary)' }}>
          Connect with classmates, form study groups, and ace your courses together.
          Collaboration made effortless.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 animate-fade-in-delay-2">
          <Link
            href="/groups"
            className="btn-primary text-base !py-3 !px-8"
          >
            Browse Groups
          </Link>
          <Link
            href="/register"
            className="btn-secondary text-base !py-3 !px-8"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
