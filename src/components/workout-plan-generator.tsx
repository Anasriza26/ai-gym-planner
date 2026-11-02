"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WorkoutPlanGenerator() {
  const [goal, setGoal] = useState("Muscle Gain");
  const [experience, setExperience] = useState("Beginner");
  const [daysPerWeek, setDaysPerWeek] = useState("4");

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  async function generateWorkoutPlan() {
    setLoading(true);
    setError("");
    setSaveMessage("");
    setPlan("");

    try {
      // 1. AI மூலம் workout plan உருவாக்குதல்
      const response = await fetch("/api/workout-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal,
          experience,
          daysPerWeek: Number(daysPerWeek),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.plan) {
        throw new Error(data.message || "Could not generate workout plan.");
      }

      // Plan-ஐ UI-யில் காட்டுதல்
      setPlan(data.plan);

      // 2. உருவாக்கிய plan-ஐ Neon Database-ல் சேமித்தல்
      const saveResponse = await fetch("/api/workout-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal,
          experience,
          daysPerWeek: Number(daysPerWeek),
          plan: data.plan,
        }),
      });

      const saveData = await saveResponse.json();

      if (!saveResponse.ok || !saveData.success) {
        setSaveMessage("plan didn't save successfully. Please try again.");
        return;
      }

      setSaveMessage("Workout plan saved successfully!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-slate-700 bg-slate-900 text-white">
      <CardHeader>
        <CardTitle>AI Workout Plan Generator</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <p className="text-sm text-slate-300">
          Customize your fitness preferences and generate a workout plan with
          Gemini AI.
        </p>

        <div className="space-y-2">
          <label htmlFor="fitness-goal" className="text-sm font-medium">
            Fitness Goal
          </label>

          <select
            id="fitness-goal"
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 p-3 text-white"
          >
            <option value="Muscle Gain">Muscle Gain</option>
            <option value="Weight Loss">Weight Loss</option>
            <option value="Strength">Strength</option>
            <option value="General Fitness">General Fitness</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="experience-level" className="text-sm font-medium">
            Experience Level
          </label>

          <select
            id="experience-level"
            value={experience}
            onChange={(event) => setExperience(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 p-3 text-white"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="workout-days" className="text-sm font-medium">
            Workout Days Per Week
          </label>

          <select
            id="workout-days"
            value={daysPerWeek}
            onChange={(event) => setDaysPerWeek(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 p-3 text-white"
          >
            <option value="1">1 day</option>
            <option value="2">2 days</option>
            <option value="3">3 days</option>
            <option value="4">4 days</option>
            <option value="5">5 days</option>
            <option value="6">6 days</option>
            <option value="7">7 days</option>
          </select>
        </div>

        <Button
          onClick={generateWorkoutPlan}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Generating Your Plan..." : "Generate My Workout Plan"}
        </Button>

        {error && (
          <p className="whitespace-pre-wrap text-sm text-red-400">{error}</p>
        )}

        {saveMessage && (
          <p
            role="status"
            className={`text-sm ${
              saveMessage.includes("successfully")
                ? "text-emerald-400"
                : "text-amber-400"
            }`}
          >
            {saveMessage}
          </p>
        )}

        {plan && (
          <Card className="border-emerald-800/60 bg-slate-950 text-white">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/15 p-3">
                  <span className="text-2xl">💪</span>
                </div>

                <div className="flex-1">
                  <CardTitle className="text-xl">Your Workout Plan</CardTitle>
                  <p className="mt-1 text-sm text-slate-400">
                    Personalized with Gemini AI
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-500/15 px-3 py-1 text-sm text-blue-300">
                  {goal}
                </span>

                <span className="rounded-full bg-purple-500/15 px-3 py-1 text-sm text-purple-300">
                  {experience}
                </span>

                <span className="rounded-full bg-amber-500/15 px-3 py-1 text-sm text-amber-300">
                  {daysPerWeek} days/week
                </span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <div className="whitespace-pre-wrap wrap-break-words text-sm leading-7 text-slate-200">
                  {plan}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={generateWorkoutPlan}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Another Plan"}
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
