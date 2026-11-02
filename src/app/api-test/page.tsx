"use client";

import { useState } from "react";

export default function ApiTestPage() {
  const [result, setResult] = useState("");

  async function sendProfile() {
    const response = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Ahmed",
        age: 23,
        height: 170,
        weight: 65,
        goal: "Muscle Gain",
        experience: "Beginner",
      }),
    });

    const data = await response.json();
    setResult(JSON.stringify(data, null, 2));
  }

  return (
    <main className="mx-auto max-w-xl space-y-4 p-8">
      <h1 className="text-2xl font-bold">POST API Test</h1>

      <button
        onClick={sendProfile}
        className="rounded-md bg-blue-600 px-4 py-2 text-white"
      >
        Send Fitness Profile
      </button>

      <pre className="overflow-auto rounded-md bg-slate-100 p-4 text-sm text-black">
        {result || "Click the button to test the API."}
      </pre>
    </main>
  );
}
