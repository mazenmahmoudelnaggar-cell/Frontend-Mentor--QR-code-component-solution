import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import livereload from "livereload";
import connectLiveReload from "connect-livereload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// ---------------- API ROUTES ----------------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ---------------- STATIC ASSETS ----------------
const isProduction = process.env.NODE_ENV === "production";
const staticDir = isProduction ? path.join(__dirname, "dist") : __dirname;

// WebP images
app.use("/webp_images", express.static(path.join(__dirname, "webp_images")));

// Serve built frontend in production
app.use(express.static(staticDir));

// SPA fallback for Vite-built frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

// ---------------- LIVE RELOAD (DEV ONLY) ----------------
if (!isProduction) {
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(staticDir);
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  app.use(connectLiveReload());
}

// ---------------- START SERVER ----------------
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
