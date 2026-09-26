"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Sidebar from "@/components/Slidebar";

interface Workspace {
  _id: string;
  name: string;
}

const cardColors = [
  { bg: "#DCFCE7", text: "#16A34A" },
  { bg: "#FFEDD5", text: "#F97316" },
  { bg: "#DBEAFE", text: "#2563EB" },
  { bg: "#FEE2E2", text: "#DC2626" },
  { bg: "#FEF9C3", text: "#CA8A04" },
];

export default function DashboardPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    const res = await apiFetch("/workspaces/mine");
    if (res.ok) {
      const data = await res.json();
      setWorkspaces(data.workspaces);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);

    const res = await apiFetch("/workspaces", {
      method: "POST",
      body: JSON.stringify({ name: newName }),
    });

    if (res.ok) {
      const data = await res.json();
      setWorkspaces((prev) => [...prev, data.workspace]);
      setNewName("");
    }
    setCreating(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar />
      <main className="flex-1 px-10 py-10">
        <h1 className="animate-step-in text-2xl font-bold text-[#111827]">
          Good morning, Chaitanya 👋
        </h1>
        <p className="animate-step-in mt-1 text-base text-[#6B7280] [animation-delay:60ms]">
          Here&apos;s what&apos;s happening in your workspace today.
        </p>

        <div className="mt-8 grid max-w-3xl grid-cols-2 gap-4">
          {[
            { label: "Workspaces", value: workspaces.length, color: "#16A34A", bg: "#DCFCE7" },
            { label: "Total Collections", value: "—", color: "#F97316", bg: "#FFEDD5" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#E5E7EB] bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#6B7280]">{stat.label}</p>
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
                  style={{ backgroundColor: stat.bg, color: stat.color }}
                >
                  ●
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-[#111827]">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 max-w-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#111827]">Your workspaces</h2>
          </div>

          <form
            onSubmit={handleCreate}
            className="animate-step-in mt-4 flex gap-3 [animation-delay:120ms]"
          >
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New workspace name"
              className="flex-1 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-base text-[#111827] placeholder-[#9CA3AF] outline-none transition-all focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/10"
            />
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-[#111827] px-5 py-2.5 text-base font-semibold text-white transition-all hover:bg-[#1F2937] active:scale-[0.98] disabled:opacity-60"
            >
              {creating ? "Creating..." : "+ New Workspace"}
            </button>
          </form>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {loading && <p className="text-base text-[#6B7280]">Loading...</p>}

            {!loading && workspaces.length === 0 && (
              <p className="text-base text-[#6B7280]">
                No workspaces yet — create your first one above.
              </p>
            )}

            {!loading &&
              workspaces.length > 0 &&
              workspaces.map((ws, i) => {
                const color = cardColors[i % cardColors.length];
                return (
                  <a
                    key={ws._id}
                    href={"/workspace/" + ws._id}
                    className="animate-step-in flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-5 transition-all hover:border-[#111827] hover:shadow-sm"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base font-bold"
                      style={{ backgroundColor: color.bg, color: color.text }}
                    >
                      {ws.name[0].toUpperCase()}
                    </span>
                    <h3 className="text-lg font-semibold text-[#111827]">
                      {ws.name}
                    </h3>
                  </a>
                );
              })}
          </div>
        </div>
      </main>
    </div>
  );
}