import { WebSocketServer } from "ws";
import http from "http";
import url from "url";
import jwt from "jsonwebtoken";
// @ts-ignore
import { setupWSConnection } from "y-websocket/bin/utils";
import { JWT_SECRET } from "../config/env";
import { isWorkspaceMember, workspaceIdForRequest } from "../utils/access";

export const setupCollabServer = (server: http.Server) => {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", async (req, socket, head) => {
    const { pathname, query } = url.parse(req.url || "", true);

    if (pathname !== "/collab") {
      socket.destroy();
      return;
    }

    const token = typeof query.token === "string" ? query.token : "";
    const room = typeof query.room === "string" ? query.room : "";

    if (!token || !room.startsWith("request-")) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const requestId = room.replace("request-", "");

      const workspaceId = await workspaceIdForRequest(requestId);
      if (!workspaceId) {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        socket.destroy();
        return;
      }

      const allowed = await isWorkspaceMember(workspaceId, decoded.userId);
      if (!allowed) {
        socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
        socket.destroy();
        return;
      }

      wss.handleUpgrade(req, socket, head, (ws) => {
        setupWSConnection(ws, req);
      });
    } catch (error) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
    }
  });

  console.log("Collaboration WebSocket server ready at /collab");
};