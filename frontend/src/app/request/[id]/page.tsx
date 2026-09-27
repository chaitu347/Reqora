"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useCollabRequest } from "@/lib/useCollabRequest";

interface RequestData {
  _id: string;
  name: string;
  method: string;
  url: string;
  body: string;
  headers: Record<string, string>;
  collectionId: string;
}

interface RunResult {
  status?: number;
  statusText?: string;
  data?: unknown;
  durationMs: number;
  error?: boolean;
  message?: string;
}

export default function RequestEditorPage() {
  const params = useParams();
  const requestId = params.id as string;

  const [loaded, setLoaded] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [initialFields, setInitialFields] = useState({
    method: "GET",
    url: "",
    body: "",
  });
  const [initialHeaders, setInitialHeaders] = useState<Record<string, string>>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchRequest();
  }, []);

  const fetchRequest = async () => {
    const res = await apiFetch("/requests/" + requestId);
    if (res.ok) {
      const data = await res.json();
      const r: RequestData = data.request;
      setRequestName(r.name);
      setInitialFields({ method: r.method, url: r.url, body: r.body || "" });
      setInitialHeaders(r.headers || {});
    }
    setLoaded(true);
  };

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
        <p className="text-lg text-[#6B7280]">Loading...</p>
      </div>
    );
  }

  return (
    <EditorBody
      requestId={requestId}
      requestName={requestName}
      initial={initialFields}
      initialHeaders={initialHeaders}
    />
  );
}

function EditorBody({
  requestId,
  requestName,
  initial,
  initialHeaders,
}: {
  requestId: string;
  requestName: string;
  initial: { method: string; url: string; body: string };
  initialHeaders: Record<string, string>;
}) {
  const { fields, headers, updateField, setHeader, removeHeader, presence, setFocusedField } =
    useCollabRequest(requestId, initial, initialHeaders);

  const [newHeaderKey, setNewHeaderKey] = useState("");
  const [newHeaderValue, setNewHeaderValue] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedJustNow, setSavedJustNow] = useState(false);

  const methodStyles = (m: string) => {
    if (m === "GET") return { text: "#2563EB", bg: "#DBEAFE", border: "#2563EB" };
    if (m === "POST") return { text: "#16A34A", bg: "#DCFCE7", border: "#16A34A" };
    if (m === "PUT" || m === "PATCH") return { text: "#F97316", bg: "#FFEDD5", border: "#F97316" };
    return { text: "#DC2626", bg: "#FEE2E2", border: "#DC2626" };
  };
  const ms = methodStyles(fields.method);

  const handleAddHeader = () => {
    if (!newHeaderKey.trim()) return;
    setHeader(newHeaderKey.trim(), newHeaderValue);
    setNewHeaderKey("");
    setNewHeaderValue("");
  };

  const handleSend = async () => {
    setSending(true);
    setResult(null);
    const res = await apiFetch("/run", {
      method: "POST",
      body: JSON.stringify({
        method: fields.method,
        url: fields.url,
        headers,
        body: fields.body,
      }),
    });
    const data = await res.json();
    setResult(data);
    setSending(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await apiFetch("/requests/" + requestId, {
      method: "PUT",
      body: JSON.stringify({
        method: fields.method,
        url: fields.url,
        body: fields.body,
        headers,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSavedJustNow(true);
      setTimeout(() => setSavedJustNow(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold"
              style={{ backgroundColor: ms.bg, color: ms.text }}
            >
              {fields.method[0]}
            </span>
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">{requestName}</h1>
              <p className="text-sm text-[#6B7280]">
                Changes sync live with anyone else viewing this request.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-2">
              {presence.map((p) => (
                <div
                  key={p.clientId}
                  title={p.name + (p.focusedField ? " — editing " + p.focusedField : "")}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name[0]?.toUpperCase()}
                </div>
              ))}
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg border-2 border-[#111827] bg-white px-4 py-2 text-sm font-bold text-[#111827] transition-all hover:bg-[#F7F8FA] disabled:opacity-60"
            >
              {saving ? "Saving..." : savedJustNow ? "Saved ✓" : "Save"}
            </button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border-2 border-[#111827] bg-white shadow-[6px_6px_0_0_#111827]">
          <div className="flex flex-wrap items-center gap-3 border-b-2 border-[#111827] bg-[#F7F8FA] p-5">
            <select
              value={fields.method}
              onChange={(e) => updateField("method", e.target.value)}
              className="rounded-lg border-2 px-4 py-3 font-[family-name:var(--font-mono)] text-base font-bold outline-none"
              style={{ borderColor: ms.border, color: ms.text, backgroundColor: ms.bg }}
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>PATCH</option>
              <option>DELETE</option>
            </select>
            <input
              type="text"
              value={fields.url}
              onChange={(e) => updateField("url", e.target.value)}
              onFocus={() => setFocusedField("URL")}
              onBlur={() => setFocusedField(null)}
              className="min-w-[280px] flex-1 rounded-lg border-2 border-[#E5E7EB] bg-white px-4 py-3 font-[family-name:var(--font-mono)] text-base text-[#111827] outline-none transition-colors focus:border-[#2563EB]"
            />
            <button
              onClick={handleSend}
              disabled={sending}
              className="rounded-lg bg-[#DC2626] px-6 py-3 text-base font-bold text-white transition-transform active:scale-95 disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>

          {/* HEADERS */}
          <div className="border-b-2 border-[#111827] p-6">
            <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#111827]">
              <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
              Headers
            </label>

            <div className="mt-3 flex flex-col gap-2">
              {Object.entries(headers).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    value={key}
                    disabled
                    className="w-1/3 rounded-lg border-2 border-[#E5E7EB] bg-[#F7F8FA] px-3 py-2 font-[family-name:var(--font-mono)] text-sm text-[#111827]"
                  />
                  <input
                    value={value}
                    onChange={(e) => setHeader(key, e.target.value)}
                    onFocus={() => setFocusedField("Header: " + key)}
                    onBlur={() => setFocusedField(null)}
                    className="flex-1 rounded-lg border-2 border-[#E5E7EB] px-3 py-2 font-[family-name:var(--font-mono)] text-sm text-[#111827] outline-none focus:border-[#2563EB]"
                  />
                  <button
                    onClick={() => removeHeader(key)}
                    className="rounded-lg border-2 border-[#DC2626] px-3 py-2 text-sm font-bold text-[#DC2626] transition-colors hover:bg-[#FEE2E2]"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <input
                  value={newHeaderKey}
                  onChange={(e) => setNewHeaderKey(e.target.value)}
                  placeholder="Header name"
                  className="w-1/3 rounded-lg border-2 border-dashed border-[#E5E7EB] px-3 py-2 font-[family-name:var(--font-mono)] text-sm text-[#111827] outline-none focus:border-[#2563EB]"
                />
                <input
                  value={newHeaderValue}
                  onChange={(e) => setNewHeaderValue(e.target.value)}
                  placeholder="Value"
                  className="flex-1 rounded-lg border-2 border-dashed border-[#E5E7EB] px-3 py-2 font-[family-name:var(--font-mono)] text-sm text-[#111827] outline-none focus:border-[#2563EB]"
                />
                <button
                  onClick={handleAddHeader}
                  className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8]"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="p-6">
            <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#111827]">
              <span className="h-2 w-2 rounded-full bg-[#F97316]" />
              Body
            </label>
            <textarea
              value={fields.body}
              onChange={(e) => updateField("body", e.target.value)}
              onFocus={() => setFocusedField("Body")}
              onBlur={() => setFocusedField(null)}
              rows={10}
              placeholder='{ "key": "value" }'
              className="mt-3 w-full rounded-xl border-2 border-[#E5E7EB] bg-[#0B0D12] px-5 py-4 font-[family-name:var(--font-mono)] text-base text-[#F7F8FA] outline-none transition-colors focus:border-[#F97316]"
            />
          </div>

          {/* RESULT */}
          {result && (
            <div className="border-t-2 border-[#111827] bg-[#F7F8FA] p-6">
              {result.error ? (
                <p className="text-base font-semibold text-[#DC2626]">
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
                    <span className="text-[#6B7280]">{result.durationMs}ms</span>
                  </div>
                  <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-[#111827] p-4 font-[family-name:var(--font-mono)] text-sm text-[#F7F8FA]">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}