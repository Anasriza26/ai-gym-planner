import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">Mohammed AI Fitness Coach</h1>

      <p className="mt-4 text-lg text-slate-300">
        Build better habits, one workout at a time.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/login"
          className="rounded-xl bg-green-500 px-6 py-3 font-semibold text-black"
        >
          Login
        </Link>

        <Link
          href="/dashboard"
          className="rounded-xl border border-slate-500 px-6 py-3"
        >
          View Dashboard
        </Link>
      </div>
    </main>
  );
}
