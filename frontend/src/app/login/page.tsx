"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Could not reach the server. Is the backend running?");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-white">
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-[#1B1D23] lg:flex">
        <svg
          viewBox="0 0 400 400"
          className="h-80 w-80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="80" r="10" fill="#FF6B4A" className="animate-node-pulse" />
          <circle cx="80" cy="220" r="10" fill="#2F6FED" className="animate-node-pulse [animation-delay:0.4s]" />
          <circle cx="320" cy="220" r="10" fill="#2F6FED" className="animate-node-pulse [animation-delay:0.8s]" />
          <circle cx="200" cy="340" r="10" fill="#FF6B4A" className="animate-node-pulse [animation-delay:1.2s]" />

          <line x1="200" y1="80" x2="80" y2="220" stroke="#3A3D46" strokeWidth="2" />
          <line x1="200" y1="80" x2="320" y2="220" stroke="#3A3D46" strokeWidth="2" />
          <line x1="80" y1="220" x2="200" y2="340" stroke="#3A3D46" strokeWidth="2" />
          <line x1="320" y1="220" x2="200" y2="340" stroke="#3A3D46" strokeWidth="2" />

          <circle r="4" fill="#FF6B4A" className="animate-travel-1" />
          <circle r="4" fill="#2F6FED" className="animate-travel-2" />
        </svg>

        <div className="absolute bottom-16 left-16 right-16">
          <h2 className="text-2xl font-semibold text-white">Welcome back.</h2>
          <p className="mt-2 text-base text-[#8B93A7]">
            Pick up right where your team left off.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <h1 className="animate-step-in text-3xl font-bold text-[#1B1D23]">
            Log in
          </h1>
          <p className="animate-step-in mt-2 text-lg text-[#6B7280] [animation-delay:60ms]">
            Welcome back to Cortex.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-base text-red-600">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#1B1D23]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-xl border border-[#E2E4E9] px-4 py-3 text-lg text-[#1B1D23] placeholder-[#A0A4AD] outline-none transition-all focus:border-[#FF6B4A] focus:ring-4 focus:ring-[#FF6B4A]/10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#1B1D23]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl border border-[#E2E4E9] px-4 py-3 text-lg text-[#1B1D23] placeholder-[#A0A4AD] outline-none transition-all focus:border-[#FF6B4A] focus:ring-4 focus:ring-[#FF6B4A]/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-xl bg-[#FF6B4A] px-4 py-3.5 text-lg font-semibold text-white transition-all hover:bg-[#FF5A35] hover:shadow-lg hover:shadow-[#FF6B4A]/25 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="animate-step-in mt-6 text-center text-base text-[#6B7280] [animation-delay:120ms]">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="font-medium text-[#2F6FED] hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}