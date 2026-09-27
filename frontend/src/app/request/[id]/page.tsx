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
  collectionId: string;
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

  return <EditorBody requestId={requestId} requestName={requestName} initial={initialFields} />;
}

function EditorBody({
  requestId,
  requestName,
  initial,
}: {
  requestId: string;
  requestName: string;
  initial: { method: string; url: string; body: string };
}) {
  const { fields, updateField, connectedUsers } = useCollabRequest(requestId, initial);

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-10 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#111827]">{requestName}</h1>
          <span className="flex items-center gap-2 rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-semibold text-[#16A34A]">
            <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
            {connectedUsers} {connectedUsers === 1 ? "person" : "people"} viewing
          </span>
        </div>
        <p className="mt-1 text-base text-[#6B7280]">
          Changes here sync live with anyone else viewing this request.
        </p>

        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-[#E5E7EB] bg-white p-5">
          <div className="flex gap-3">
            <select
              value={fields.method}
              onChange={(e) => updateField("method", e.target.value)}
              className="rounded-lg border border-[#E5E7EB] px-3 py-2 font-[family-name:var(--font-mono)] text-sm font-bold text-[#111827] outline-none focus:border-[#111827]"
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
              className="flex-1 rounded-lg border border-[#E5E7EB] px-3.5 py-2 font-[family-name:var(--font-mono)] text-sm text-[#111827] outline-none focus:border-[#111827]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Body</label>
            <textarea
              value={fields.body}
              onChange={(e) => updateField("body", e.target.value)}
              rows={6}
              placeholder='{ "key": "value" }'
              className="rounded-lg border border-[#E5E7EB] px-3.5 py-2 font-[family-name:var(--font-mono)] text-sm text-[#111827] outline-none focus:border-[#111827]"
            />
          </div>
        </div>
      </div>
    </main>
  );
}