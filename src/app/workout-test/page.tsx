"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WorkoutTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function testWorkoutAPI() {
    setLoading(true);
    setResult("");
    setError("");

    try {
      const response = await fetch("/api/workout-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal: "Muscle Gain",
          experience: "Beginner",
          daysPerWeek: 4,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Workout API test failed.");
      }

      setResult(data.plan || "No workout plan was returned.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container mx-auto max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Workout Plan Test</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Goal: Muscle Gain · Experience: Beginner · Training: 4 days per week
          </p>

          <Button onClick={testWorkoutAPI} disabled={loading}>
            {loading ? "Generating workout plan..." : "Test Workout API"}
          </Button>

          {error && (
            <div className="rounded-md border border-red-300 p-4 text-red-600">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="rounded-md border p-4">
              <h2 className="mb-3 font-semibold">Your AI Workout Plan</h2>
              <div className="whitespace-pre-wrap text-sm leading-7">
                {result}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
