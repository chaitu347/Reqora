import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

interface CollabFields {
  method: string;
  url: string;
  body: string;
}

export function useCollabRequest(requestId: string, initial: CollabFields) {
  const [fields, setFields] = useState<CollabFields>(initial);
  const [connectedUsers, setConnectedUsers] = useState(1);
  const ymapRef = useRef<Y.Map<string> | null>(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      "ws://localhost:4000/collab",
      "request-" + requestId,
      ydoc
    );
    const ymap = ydoc.getMap<string>("fields");
    ymapRef.current = ymap;

    if (ymap.size === 0) {
      ymap.set("method", initial.method);
      ymap.set("url", initial.url);
      ymap.set("body", initial.body);
    }

    const updateFromYjs = () => {
      setFields({
        method: ymap.get("method") ?? "",
        url: ymap.get("url") ?? "",
        body: ymap.get("body") ?? "",
      });
    };

    ymap.observe(updateFromYjs);
    updateFromYjs();

    provider.awareness.on("change", () => {
      setConnectedUsers(provider.awareness.getStates().size);
    });

    return () => {
      ymap.unobserve(updateFromYjs);
      provider.destroy();
      ydoc.destroy();
    };
  }, [requestId]);

  const updateField = (key: keyof CollabFields, value: string) => {
    ymapRef.current?.set(key, value);
  };

  return { fields, updateField, connectedUsers };
}