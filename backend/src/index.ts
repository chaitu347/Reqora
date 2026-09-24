import express from "express";
import { PORT } from "./config/env";
import { connectDB } from "./config/db";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();