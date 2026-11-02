"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type WorkoutPlan = {
  id: number | string;
  goal: string;
  experience: string;
  days_per_week: number;
  plan: string;
  created_at: string;
};

export default function WorkoutHistoryPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchWorkoutPlans() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/workout-plans");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load workout history.");
        }

        setPlans(data.plans);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchWorkoutPlans();
  }, []);

  function togglePlan(id: string) {
    setExpandedPlanId((currentId) => (currentId === id ? null : id));
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              YOUR FITNESS JOURNEY
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Workout History
            </h1>

            <p className="mt-2 text-muted-foreground">
              View your previously generated workout plans.
            </p>
          </div>

          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        {loading && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Loading your workout history...
            </CardContent>
          </Card>
        )}

        {!loading && error && (
          <Card>
            <CardContent className="space-y-4 py-8 text-center">
              <p className="text-destructive">{error}</p>

              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && plans.length === 0 && (
          <Card>
            <CardContent className="space-y-4 py-10 text-center">
              <h2 className="text-xl font-semibold">No Workout Plans Yet</h2>

              <p className="text-muted-foreground">
                Generate your first workout plan to see it here.
              </p>

              <Button onClick={() => router.push("/dashboard")}>
                Generate Workout Plan
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && plans.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Saved Plans</h2>

              <p className="text-sm text-muted-foreground">
                {plans.length} {plans.length === 1 ? "plan" : "plans"}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {plans.map((workout) => {
                const planId = String(workout.id);
                const isExpanded = expandedPlanId === planId;

                return (
                  <Card key={planId} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle>{workout.goal}</CardTitle>

                          <CardDescription className="mt-2">
                            {workout.experience} Level
                          </CardDescription>
                        </div>

                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {workout.days_per_week} Days / Week
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col gap-4">
                      <p className="text-sm text-muted-foreground">
                        Saved on{" "}
                        {new Date(workout.created_at).toLocaleDateString()}
                      </p>

                      {isExpanded && (
                        <div className="rounded-lg border bg-muted/30 p-4">
                          <h3 className="mb-3 font-semibold">
                            Full Workout Plan
                          </h3>

                          <div className="whitespace-pre-wrap wrap-break-words text-sm leading-7">
                            {workout.plan}
                          </div>
                        </div>
                      )}

                      <div className="mt-auto pt-2">
                        <Button
                          className="w-full"
                          variant={isExpanded ? "outline" : "default"}
                          onClick={() => togglePlan(planId)}
                        >
                          {isExpanded
                            ? "Hide Workout Plan"
                            : "View Full Workout Plan"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
