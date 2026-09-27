import { WebSocketServer } from "ws";
import http from "http";
import { setupWSConnection } from "y-websocket/bin/utils";

export const setupCollabServer = (server: http.Server) => {
  const wss = new WebSocketServer({ server, path: "/collab" });

  wss.on("connection", (ws, req) => {
    setupWSConnection(ws, req);
  });

  console.log("Collaboration WebSocket server ready at /collab");
};