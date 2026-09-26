"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface RequestItem {
  _id: string;
  name: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
}

interface RunResult {
  status?: number;
  statusText?: string;
  data?: unknown;
  durationMs: number;
  error?: boolean;
  message?: string;
}

export default function CollectionPage() {
  const params = useParams();
  const collectionId = params.id as string;

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [creating, setCreating] = useState(false);

  const [runningId, setRunningId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, RunResult>>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await apiFetch("/requests/collection/" + collectionId);
    if (res.ok) {
      const data = await res.json();
      setRequests(data.requests);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    setCreating(true);

    const res = await apiFetch("/requests", {
      method: "POST",
      body: JSON.stringify({
        name,
        method,
        url,
        headers: {},
        body: "",
        collectionId,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setRequests((prev) => [...prev, data.request]);
      setName("");
      setUrl("");
    }
    setCreating(false);
  };

  const handleRun = async (req: RequestItem) => {
    setRunningId(req._id);

    const res = await apiFetch("/run", {
      method: "POST",
      body: JSON.stringify({
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
      }),
    });

    const data = await res.json();
    setResults((prev) => ({ ...prev, [req._id]: data }));
    setRunningId(null);
  };

  const methodColor = (m: string) => {
    if (m === "GET") return "text-[#2F6FED] bg-[#2F6FED]/10";
    if (m === "POST") return "text-[#16A34A] bg-[#16A34A]/10";
    if (m === "PUT" || m === "PATCH") return "text-[#D97706] bg-[#D97706]/10";
    return "text-[#DC2626] bg-[#DC2626]/10";
  };

  return (
    <main className="min-h-screen bg-[#F5F6F8] px-8 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="animate-step-in text-3xl font-bold text-[#1B1D23]">
          Requests
        </h1>
        <p className="animate-step-in mt-2 text-lg text-[#6B7280] [animation-delay:60ms]">
          Save and run API calls inside this collection.
        </p>

        <form
          onSubmit={handleCreate}
          className="animate-step-in mt-8 flex flex-col gap-3 rounded-xl border border-[#E2E4E9] bg-white p-5 [animation-delay:120ms]"
        >
          <div className="flex gap-3">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="rounded-xl border border-[#E2E4E9] px-3 py-3 text-base font-semibold text-[#1B1D23] outline-none focus:border-[#FF6B4A]"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>PATCH</option>
              <option>DELETE</option>
            </select>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="flex-1 rounded-xl border border-[#E2E4E9] px-4 py-3 text-lg text-[#1B1D23] placeholder-[#A0A4AD] outline-none focus:border-[#FF6B4A]"
            />
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Request name (e.g. Get all users)"
              className="flex-1 rounded-xl border border-[#E2E4E9] px-4 py-3 text-lg text-[#1B1D23] placeholder-[#A0A4AD] outline-none focus:border-[#FF6B4A]"
            />
            <button
              type="submit"
              disabled={creating}
              className="rounded-xl bg-[#FF6B4A] px-6 py-3 text-lg font-semibold text-white transition-all hover:bg-[#FF5A35] active:scale-[0.98] disabled:opacity-60"
            >
              {creating ? "Saving..." : "Save"}
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-col gap-4">
          {loading && <p className="text-lg text-[#6B7280]">Loading...</p>}

          {!loading && requests.length === 0 && (
            <p className="text-lg text-[#6B7280]">
              No requests yet — save your first one above.
            </p>
          )}

          {!loading &&
            requests.map((req) => {
              const result = results[req._id];
              const isRunning = runningId === req._id;

              return (
                <div
                  key={req._id}
                  className="animate-step-in rounded-xl border border-[#E2E4E9] bg-white p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          "rounded-md px-2.5 py-1 text-sm font-bold " +
                          methodColor(req.method)
                        }
                      >
                        {req.method}
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-[#1B1D23]">
                          {req.name}
                        </p>
                        <p className="text-sm text-[#6B7280]">{req.url}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRun(req)}
                      disabled={isRunning}
                      className="shrink-0 rounded-xl bg-[#1B1D23] px-5 py-2.5 text-base font-semibold text-white transition-all hover:bg-[#2A2D35] active:scale-[0.98] disabled:opacity-60"
                    >
                      {isRunning ? "Sending..." : "Send"}
                    </button>
                  </div>

                  {result && (
                    <div className="animate-step-in mt-4 rounded-lg border border-[#E2E4E9] bg-[#F5F6F8] p-4">
                      {result.error ? (
                        <p className="text-base text-[#DC2626]">
                          Error: {result.message}
                        </p>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 text-sm">
                            <span
                              className={
                                "rounded px-2 py-0.5 font-bold " +
                                ((result.status ?? 0) < 400
                                  ? "bg-[#16A34A]/10 text-[#16A34A]"
                                  : "bg-[#DC2626]/10 text-[#DC2626]")
                              }
                            >
                              {result.status} {result.statusText}
                            </span>
                            <span className="text-[#6B7280]">
                              {result.durationMs}ms
                            </span>
                          </div>
                          <pre className="mt-3 max-h-64 overflow-auto rounded-md bg-[#1B1D23] p-3 text-sm text-[#ECEDEE]">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}