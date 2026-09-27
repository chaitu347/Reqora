"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Sidebar from "@/components/Sidebar";

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
    if (m === "GET") return "text-[#16A34A] bg-[#DCFCE7]";
    if (m === "POST") return "text-[#2563EB] bg-[#DBEAFE]";
    if (m === "PUT" || m === "PATCH") return "text-[#F97316] bg-[#FFEDD5]";
    return "text-[#DC2626] bg-[#FEE2E2]";
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar />
      <main className="flex-1 px-10 py-10">
        <h1 className="animate-step-in text-2xl font-bold text-[#111827]">
          Requests
        </h1>
        <p className="animate-step-in mt-1 text-base text-[#6B7280] [animation-delay:60ms]">
          Save and run API calls inside this collection.
        </p>

        <form
          onSubmit={handleCreate}
          className="animate-step-in mt-6 max-w-2xl overflow-hidden rounded-xl border border-[#E5E7EB] bg-white [animation-delay:120ms]"
        >
          <div className="flex items-center gap-2 p-3">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className={
                "rounded-lg px-3 py-2 font-[family-name:var(--font-mono)] text-sm font-bold outline-none " +
                methodColor(method)
              }
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
              placeholder="https://api.reqora.com/v1/endpoint"
              className="flex-1 rounded-lg border border-[#E5E7EB] px-3.5 py-2 font-[family-name:var(--font-mono)] text-sm text-[#111827] placeholder-[#9CA3AF] outline-none focus:border-[#111827]"
            />
            <button
              type="submit"
              disabled={creating}
              className="shrink-0 rounded-lg bg-[#16A34A] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#15803D] active:scale-[0.98] disabled:opacity-60"
            >
              {creating ? "Saving..." : "Save"}
            </button>
          </div>
          <div className="border-t border-[#E5E7EB] p-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Request name (e.g. Get all users)"
              className="w-full rounded-lg border border-[#E5E7EB] px-3.5 py-2 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none focus:border-[#111827]"
            />
          </div>
        </form>

        <div className="mt-6 flex max-w-2xl flex-col gap-4">
          {loading && <p className="text-base text-[#6B7280]">Loading...</p>}

          {!loading && requests.length === 0 && (
            <p className="text-base text-[#6B7280]">
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
                  className="animate-step-in overflow-hidden rounded-xl border border-[#E5E7EB] bg-white"
                >
                  <div className="flex items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          "rounded-md px-2.5 py-1 font-[family-name:var(--font-mono)] text-xs font-bold " +
                          methodColor(req.method)
                        }
                      >
                        {req.method}
                      </span>
                      <div>
                        <a
                          href={"/request/" + req._id}
                          className="text-base font-semibold text-[#111827] hover:underline"
                        >
                          {req.name}
                        </a>
                        <p className="font-[family-name:var(--font-mono)] text-xs text-[#6B7280]">
                          {req.url}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRun(req)}
                      disabled={isRunning}
                      className="shrink-0 rounded-lg bg-[#16A34A] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#15803D] active:scale-[0.98] disabled:opacity-60"
                    >
                      {isRunning ? "Sending..." : "Send"}
                    </button>
                  </div>
                  
                  {result && (
                    <div className="animate-step-in border-t border-[#E5E7EB] bg-[#F7F8FA] p-4">
                      {result.error ? (
                        <p className="text-sm text-[#DC2626]">
                          Error: {result.message}
                        </p>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 text-sm">
                            <span
                              className={
                                "rounded px-2 py-0.5 font-bold " +
                                ((result.status ?? 0) < 400
                                  ? "bg-[#DCFCE7] text-[#16A34A]"
                                  : "bg-[#FEE2E2] text-[#DC2626]")
                              }
                            >
                              {result.status} {result.statusText}
                            </span>
                            <span className="text-[#6B7280]">
                              {result.durationMs}ms
                            </span>
                          </div>
                          <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-[#111827] p-3 font-[family-name:var(--font-mono)] text-xs text-[#F7F8FA]">
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
      </main>
    </div>
  );
}