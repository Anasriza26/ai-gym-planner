"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const RESEND_COOLDOWN_SECONDS = 60;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = (searchParams.get("email") ?? "").trim().toLowerCase();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(
    RESEND_COOLDOWN_SECONDS,
  );

  useEffect(() => {
    if (secondsRemaining <= 0) return;

    const timer = window.setTimeout(() => {
      setSecondsRemaining((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsRemaining]);

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email address is missing. Please sign up again.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the complete 6-digit verification code.");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Unable to verify your email.");
        return;
      }

      router.replace("/login?verified=true");
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");

    if (!email) {
      setError("Email address is missing. Please sign up again.");
      return;
    }

    setIsResending(true);

    try {
      const response = await fetch("/api/auth/otp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Unable to request a new code.");
        return;
      }

      setSecondsRemaining(RESEND_COOLDOWN_SECONDS);
      setMessage(
        result.message || "If eligible, a new verification code will be sent.",
      );
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-green-400">
            AI Gym Planner
          </p>

          <h1 className="text-3xl font-bold">Verify Your Email</h1>

          <p className="mt-3 text-sm text-slate-400">
            Enter the 6-digit code sent to your email address.
          </p>

          {email && (
            <p className="mt-3 break-all text-sm font-medium text-slate-200">
              {email}
            </p>
          )}
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label
              htmlFor="otp"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Verification Code
            </label>

            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              required
              disabled={isVerifying}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4 text-center text-2xl tracking-[0.5em] text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:opacity-60"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              role="status"
              className="rounded-lg bg-green-500/10 p-3 text-sm text-green-300"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isVerifying || otp.length !== 6 || !email}
            className="w-full rounded-lg bg-green-500 p-3 font-semibold text-slate-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || secondsRemaining > 0 || !email}
            className="text-sm font-semibold text-green-400 hover:text-green-300 disabled:cursor-not-allowed disabled:text-slate-500"
          >
            {isResending
              ? "Requesting..."
              : secondsRemaining > 0
                ? `Resend code in ${secondsRemaining}s`
                : "Resend verification code"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already verified?{" "}
          <Link
            href="/login"
            className="font-semibold text-green-400 hover:text-green-300"
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
          <p>Loading verification page...</p>
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
