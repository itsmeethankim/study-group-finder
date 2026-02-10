import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Study Group Finder
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          Find study groups for your courses or create your own to collaborate
          with classmates.
        </p>
        <Link
          href="/groups"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-zinc-900 px-6 py-3 text-base font-medium text-white transition hover:bg-zinc-800"
        >
          Browse Groups
        </Link>
      </div>
    </div>
  );
}
