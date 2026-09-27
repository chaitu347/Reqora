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
      localStorage.setItem("userName", data.user.name);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Could not reach the server. Is the backend running?");
      setLoading(false);
    }
  };

  const avatarColors = ["#16A34A", "#F97316", "#2563EB", "#DC2626", "#EAB308"];

  return (
    <main className="flex min-h-screen bg-white">
      {/* LEFT — same as signup */}
      <div className="hidden w-1/2 flex-col justify-center bg-[#F7F8FA] px-16 lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#16A34A] via-[#F97316] to-[#2563EB] text-sm font-bold text-white">
            R
          </div>
          <span className="text-xl font-bold text-[#111827]">Reqora</span>
        </div>

        <h1 className="mt-10 text-4xl font-bold leading-tight text-[#111827]">
          Build APIs together.
          <br />
          Ship without <span className="text-[#F97316]">stepping</span>
          <br />
          on each other.
        </h1>
        <p className="mt-4 max-w-sm text-lg text-[#6B7280]">
          Collaborative API development platform for modern teams. Work on
          different APIs, track progress, and build faster — together.
        </p>

        <div className="mt-10 flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#2563EB]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17 20v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 10a4 4 0 100-8 4 4 0 000 8zM23 20v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-[#111827]">Team Collaboration</p>
              <p className="text-sm text-[#6B7280]">Work together in real-time</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFEDD5] text-[#F97316]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-[#111827]">Shared Collections</p>
              <p className="text-sm text-[#6B7280]">Organize & manage your APIs</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DCFCE7] text-[#16A34A]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-[#111827]">Track Progress</p>
              <p className="text-sm text-[#6B7280]">See who&apos;s working on what</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {avatarColors.map((c) => (
              <div
                key={c}
                className="h-8 w-8 rounded-full border-2 border-[#F7F8FA]"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <p className="text-sm text-[#6B7280]">Trusted by 5,000+ developers</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] text-sm font-bold text-white">
              R
            </div>
            <span className="text-lg font-bold text-[#111827]">Reqora</span>
          </div>

          <div className="mt-6 flex gap-6 border-b border-[#E5E7EB] lg:mt-0">
            <span className="border-b-2 border-[#111827] pb-3 text-base font-semibold text-[#111827]">
              Login
            </span>
            <a href="/signup" className="pb-3 text-base font-medium text-[#9CA3AF]">
              Sign Up
            </a>
          </div>

          <h1 className="mt-6 text-2xl font-bold text-[#111827]">Welcome back</h1>
          <p className="mt-1 text-base text-[#6B7280]">Sign in to your workspace.</p>

          <div className="mt-6 flex flex-col gap-3">
            <button className="flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] py-2.5 text-base font-medium text-[#374151] transition-colors hover:bg-[#F7F8FA]">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2563EB] text-[10px] font-bold text-white">G</span>
              Continue with Google
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] py-2.5 text-base font-medium text-[#374151] transition-colors hover:bg-[#F7F8FA]">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#111827] text-[10px] font-bold text-white">G</span>
              Continue with GitHub
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E5E7EB]" />
            <span className="text-sm text-[#9CA3AF]">OR</span>
            <div className="h-px flex-1 bg-[#E5E7EB]" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#374151]">Work email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="rounded-lg border border-[#E5E7EB] px-3.5 py-2.5 text-base text-[#111827] placeholder-[#9CA3AF] outline-none transition-all focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#374151]">Password</label>
                <a href="#" className="text-sm text-[#2563EB] hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="rounded-lg border border-[#E5E7EB] px-3.5 py-2.5 text-base text-[#111827] placeholder-[#9CA3AF] outline-none transition-all focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-lg bg-[#111827] px-4 py-3 text-base font-semibold text-white transition-all hover:bg-[#1F2937] active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Enter Workspace →"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6B7280]">
            New to Reqora?{" "}
            <a href="/signup" className="font-medium text-[#2563EB] hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}