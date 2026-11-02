import { redirect } from "next/navigation";
import { auth } from "@/auth";
import WorkoutPlanGenerator from "@/components/workout-plan-generator";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";

export const instant = false;

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold">Your Fitness Dashboard</h1>

      <p className="mt-3 text-slate-300">
        Welcome, {session.user.name ?? session.user.email ?? "User"}!
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/workout-history"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          View Workout History
        </Link>

        <SignOutButton />
      </div>

      <div className="mt-8">
        <WorkoutPlanGenerator />
      </div>
    </main>
  );
}
