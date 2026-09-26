"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Workspace {
  _id: string;
  name: string;
}

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
    <main className="min-h-screen bg-[#F5F6F8] px-8 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="animate-step-in text-3xl font-bold text-[#1B1D23]">
          Your workspaces
        </h1>
        <p className="animate-step-in mt-2 text-lg text-[#6B7280] [animation-delay:60ms]">
          Pick a workspace to continue, or create a new one.
        </p>

        <form
          onSubmit={handleCreate}
          className="animate-step-in mt-8 flex gap-3 [animation-delay:120ms]"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New workspace name"
            className="flex-1 rounded-xl border border-[#E2E4E9] bg-white px-4 py-3 text-lg text-[#1B1D23] placeholder-[#A0A4AD] outline-none transition-all focus:border-[#FF6B4A] focus:ring-4 focus:ring-[#FF6B4A]/10"
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-xl bg-[#FF6B4A] px-6 py-3 text-lg font-semibold text-white transition-all hover:bg-[#FF5A35] active:scale-[0.98] disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </form>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {loading && (
            <p className="text-lg text-[#6B7280]">Loading...</p>
          )}

          {!loading && workspaces.length === 0 && (
            <p className="text-lg text-[#6B7280]">
              No workspaces yet — create your first one above.
            </p>
          )}

         {!loading &&
           workspaces.length > 0 &&
           workspaces.map((ws) => {
           return (
            <a
              key={ws._id}
              href={"/workspace/" + ws._id}
              className="animate-step-in rounded-xl border border-[#E2E4E9] bg-white p-6 transition-all hover:border-[#FF6B4A] hover:shadow-md"
            >
            <h3 className="text-xl font-semibold text-[#1B1D23]">
               {ws.name}
            </h3>
            </a>
            );
        })}
        </div>
      </div>
    </main>
  );
}