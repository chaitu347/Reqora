# Reqora

**A collaborative API workspace — build, test, and document APIs together in real time.**

Reqora is a full-stack tool inspired by Postman, built for teams who want to work on the same API requests simultaneously — see who's editing what, watch changes sync live, and never overwrite a teammate's work.

🔗 **Live demo:** https://reqora-frontend.vercel.app
💻 **Backend repo:** https://github.com/chaitu347/reqora-backend
💻 **Frontend repo:** https://github.com/chaitu347/reqora-frontend

---

## Why this project

Most Postman-clone portfolio projects stop at CRUD: save a request, send it, see the response. Reqora goes further — the core differentiator is **real-time collaborative editing**, powered by CRDTs (Conflict-free Replicated Data Types), the same category of technology behind Google Docs and Figma's multiplayer features. Two people can have the same request open, edit different fields at the same time, and never lose each other's changes.

## Features

- **Auth** — JWT-based signup/login, bcrypt password hashing, protected routes
- **Workspaces → Collections → Requests** — a three-level hierarchy for organizing APIs, mirroring how real teams structure their API surface
- **Request runner** — executes any saved HTTP request (GET/POST/PUT/PATCH/DELETE) server-side and returns status, timing, and response data
- **Real-time collaboration** — live sync on method, URL, headers, and body across every open tab, built with Yjs CRDTs over a custom WebSocket server
- **Live presence** — see who else is viewing a request, with colored avatars and per-field "editing" indicators
- **Team invites** — add teammates to a workspace by email
- **Access control** — every endpoint and the WebSocket handshake itself verify workspace membership, not just authentication (closes an IDOR-class vulnerability class)
- **Version history** — every save snapshots the previous state, with who changed it and when

## Tech stack

**Frontend:** Next.js (App Router) · TypeScript · Tailwind CSS · Yjs · y-websocket

**Backend:** Node.js · Express · TypeScript · MongoDB · Mongoose · JWT · bcrypt · ws · y-websocket

**Infrastructure:** MongoDB Atlas · Render (backend) · Vercel (frontend)

## Architecture

```
┌─────────────┐         HTTPS (REST)          ┌──────────────┐
│   Next.js   │ ─────────────────────────────▶ │   Express    │
│  Frontend   │ ◀───────────────────────────── │   Backend    │
│  (Vercel)   │                                 │   (Render)   │
└─────────────┘         WSS (real-time)        └──────┬───────┘
       │         ─────────────────────────────▶       │
       │ ◀─────────────────────────────────────       │
       │          (Yjs sync via ws)                    │
                                                         ▼
                                                 ┌──────────────┐
                                                 │   MongoDB    │
                                                 │    Atlas     │
                                                 └──────────────┘
```

**Data model:**
```
User
 └── Workspace (owner, members[])
       └── Collection
             └── Request (method, url, headers, body)
                   └── RequestVersion (snapshot history)
```

A single Node HTTP server handles two protocols on one port: Express serves the REST API (`/api/...`), and a raw `ws` WebSocket server (attached via `server.on("upgrade")`) handles real-time sync on `/collab` — each connection is authenticated with a JWT passed as a query parameter during the handshake, and checked against workspace membership before the connection is accepted.

## Security

- Passwords hashed with bcrypt (10 salt rounds), never returned in any API response (`select: false` at the schema level)
- JWTs signed server-side, verified on every protected REST call and every WebSocket connection attempt
- **Workspace-level access control**: every workspace, collection, and request endpoint checks that the requesting user is actually a member of that workspace — not just that they're logged in. This closes an IDOR (Insecure Direct Object Reference) vulnerability where any authenticated user could otherwise read or edit another team's data just by guessing or reusing an ID.
- CORS locked to the deployed frontend origin in production

## Getting started locally

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB)

### Backend
```bash
cd backend
npm install
```
Create a `.env` file:
```
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```
```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
```
Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000/collab
```
```bash
npm run dev
```

Visit `http://localhost:3000`.

## What I'd build next

- Sandboxed post-request scripts (extract a value from one response, use it in the next request — like Postman's test scripts)
- Public, shareable API documentation generated from a collection
- Role-based permissions (viewer vs. editor, beyond just "member")

## About

Built by Merugula Chaitanya — [GitHub](https://github.com/chaitu347) · [LinkedIn](https://www.linkedin.com/in/merugula-chaitanya-5044b7272)
