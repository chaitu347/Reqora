import express from "express";
import { PORT } from "./config/env";
import { connectDB } from "./config/db";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import workspaceRoutes from "./routes/workspace.routes";
import collectionRoutes from "./routes/collection.routes";
import requestRoutes from "./routes/request.routes";

const app = express();

app.use(express.json());
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/requests", requestRoutes);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();