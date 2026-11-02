"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CounterPage() {
  const [count, setCount] = useState(0);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardContent className="space-y-4 p-6 text-center">
          <h1 className="text-2xl font-bold">Workout Counter</h1>

          <p className="text-4xl font-bold">{count}</p>

          <Button onClick={() => setCount(count + 1)} className="w-full">
            Complete a Workout
          </Button>

          <Button
            variant="outline"
            onClick={() => setCount(0)}
            className="w-full"
          >
            Reset
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
