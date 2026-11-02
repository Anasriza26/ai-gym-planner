"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold">Welcome Back</h1>

      <p className="mt-4 text-slate-300">
        Login to your AI Gym Planner account.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex w-full max-w-sm flex-col gap-4"
      >
        <label htmlFor="email" className="text-sm text-slate-200">
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="rounded-lg bg-white p-3 text-black outline-none focus:ring-2 focus:ring-green-500"
        />

        <label htmlFor="password" className="text-sm text-slate-200">
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter Your Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="rounded-lg bg-white p-3 text-black outline-none focus:ring-2 focus:ring-green-500"
        />

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-green-500 p-3 font-semibold text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* Sign Up Button  */}
        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="rounded-lg bg-blue-500 p-3 font-semibold text-black transition hover:bg-blue-400"
        >
          Sign Up
        </button>
      </form>
    </main>
  );
}
