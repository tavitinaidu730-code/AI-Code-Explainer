import path from "path";
import dotenv from "dotenv";

// ✅ Explicitly tell dotenv where to find .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleExplainCode } from "./routes/explain";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Check that key is loaded
  console.log(
    process.env.OPENAI_API_KEY
      ? "✅ OpenAI key loaded"
      : "❌ OpenAI key missing (check .env path)"
  );

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/explain", handleExplainCode);

  return app;
}
