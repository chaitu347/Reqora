"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Sidebar from "@/components/Slidebar";

interface CollectionItem {
  _id: string;
  name: string;
}

const badgeColors = [
  { bg: "#DCFCE7", text: "#16A34A" },
  { bg: "#FFEDD5", text: "#F97316" },
  { bg: "#DBEAFE", text: "#2563EB" },
  { bg: "#FEE2E2", text: "#DC2626" },
  { bg: "#FEF9C3", text: "#CA8A04" },
];

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = params.id as string;

  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    const res = await apiFetch("/collections/workspace/" + workspaceId);
    if (res.ok) {
      const data = await res.json();
      setCollections(data.collections);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);

    const res = await apiFetch("/collections", {
      method: "POST",
      body: JSON.stringify({ name: newName, workspaceId: workspaceId }),
    });

    if (res.ok) {
      const data = await res.json();
      setCollections((prev) => [...prev, data.collection]);
      setNewName("");
    }
    setCreating(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar />
      <main className="flex-1 px-10 py-10">
        <a href="/dashboard" className="text-sm font-medium text-[#2563EB] hover:underline">
          ← Back to workspaces
        </a>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <h1 className="animate-step-in text-2xl font-bold text-[#111827]">
              Collections
            </h1>
            <p className="animate-step-in mt-1 text-base text-[#6B7280] [animation-delay:60ms]">
              Organize your APIs into collections and keep your services structured.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleCreate}
          className="animate-step-in mt-6 flex max-w-2xl gap-3 [animation-delay:120ms]"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New collection name"
            className="flex-1 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-base text-[#111827] placeholder-[#9CA3AF] outline-none transition-all focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/10"
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-[#111827] px-5 py-2.5 text-base font-semibold text-white transition-all hover:bg-[#1F2937] active:scale-[0.98] disabled:opacity-60"
          >
            {creating ? "Creating..." : "+ New Collection"}
          </button>
        </form>

        <div className="mt-6 max-w-2xl overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
          {loading && (
            <p className="p-5 text-base text-[#6B7280]">Loading...</p>
          )}

          {!loading && collections.length === 0 && (
            <p className="p-5 text-base text-[#6B7280]">
              No collections yet — create your first one above.
            </p>
          )}

          {!loading &&
            collections.map((col, i) => {
              const color = badgeColors[i % badgeColors.length];
              return (
                <a
                  key={col._id}
                  href={"/collection/" + col._id}
                  className="animate-step-in flex items-center gap-3 border-b border-[#E5E7EB] px-5 py-4 transition-colors last:border-b-0 hover:bg-[#F7F8FA]"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                    style={{ backgroundColor: color.bg, color: color.text }}
                  >
                    {col.name[0].toUpperCase()}
                  </span>
                  <p className="text-base font-semibold text-[#111827]">
                    {col.name}
                  </p>
                </a>
              );
            })}
        </div>
      </main>
    </div>
  );
}