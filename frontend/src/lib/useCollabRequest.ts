import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

interface CollabFields {
  method: string;
  url: string;
  body: string;
}

interface PresenceUser {
  clientId: number;
  name: string;
  color: string;
  focusedField: string | null;
}

const USER_COLORS = ["#2563EB", "#16A34A", "#F97316", "#DC2626", "#9333EA", "#EAB308"];

export function useCollabRequest(
  requestId: string,
  initial: CollabFields,
  initialHeaders: Record<string, string>
) {
  const [fields, setFields] = useState<CollabFields>(initial);
  const [headers, setHeaders] = useState<Record<string, string>>(initialHeaders);
  const [presence, setPresence] = useState<PresenceUser[]>([]);

  const ymapRef = useRef<Y.Map<string> | null>(null);
  const yheadersRef = useRef<Y.Map<string> | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  useEffect(() => {
    const ydoc = new Y.Doc();

    const token = localStorage.getItem("token") || "";
    const provider = new WebsocketProvider(
      "ws://localhost:4000/collab",
      "request-" + requestId,
      ydoc,
      { params: { token } }
    );
    providerRef.current = provider;

    const ymap = ydoc.getMap<string>("fields");
    ymapRef.current = ymap;

    const yheaders = ydoc.getMap<string>("headers");
    yheadersRef.current = yheaders;

    if (ymap.size === 0) {
      ymap.set("method", initial.method);
      ymap.set("url", initial.url);
      ymap.set("body", initial.body);
    }

    if (yheaders.size === 0 && Object.keys(initialHeaders).length > 0) {
      Object.entries(initialHeaders).forEach(([k, v]) => yheaders.set(k, v));
    }

    const updateFieldsFromYjs = () => {
      setFields({
        method: ymap.get("method") ?? "",
        url: ymap.get("url") ?? "",
        body: ymap.get("body") ?? "",
      });
    };

    const updateHeadersFromYjs = () => {
      const obj: Record<string, string> = {};
      yheaders.forEach((value, key) => {
        obj[key] = value;
      });
      setHeaders(obj);
    };

    ymap.observe(updateFieldsFromYjs);
    yheaders.observe(updateHeadersFromYjs);
    updateFieldsFromYjs();
    updateHeadersFromYjs();

    const myName = localStorage.getItem("userName") || "Anonymous";
    const myColor = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];

    const updatePresence = () => {
      const states = provider.awareness.getStates();
      const users: PresenceUser[] = [];
      states.forEach((state, clientId) => {
        if (state.user) {
          users.push({
            clientId,
            name: state.user.name,
            color: state.user.color,
            focusedField: state.user.focusedField ?? null,
          });
        }
      });
      setPresence(users);
    };

    provider.awareness.on("change", updatePresence);
    provider.awareness.setLocalStateField("user", {
      name: myName,
      color: myColor,
      focusedField: null,
    });
    updatePresence();

    return () => {
      ymap.unobserve(updateFieldsFromYjs);
      yheaders.unobserve(updateHeadersFromYjs);
      provider.awareness.off("change", updatePresence);
      provider.destroy();
      ydoc.destroy();
    };
  }, [requestId]);

  const updateField = (key: keyof CollabFields, value: string) => {
    ymapRef.current?.set(key, value);
  };

  const setHeader = (key: string, value: string) => {
    yheadersRef.current?.set(key, value);
  };

  const removeHeader = (key: string) => {
    yheadersRef.current?.delete(key);
  };

  const setFocusedField = (fieldName: string | null) => {
    const provider = providerRef.current;
    if (!provider) return;
    const current = provider.awareness.getLocalState()?.user;
    provider.awareness.setLocalStateField("user", {
      ...current,
      focusedField: fieldName,
    });
  };

  return {
    fields,
    headers,
    updateField,
    setHeader,
    removeHeader,
    presence,
    setFocusedField,
  };
}