import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import livereload from "livereload";
import connectLivereload from "connect-livereload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// ---------- LiveReload ----------
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));
liveReloadServer.watch(path.join(__dirname, "src"));

app.use(connectLivereload());

// ---------- Serve static folders ----------
app.use(express.static(path.join(__dirname, "public")));
app.use("/src", express.static(path.join(__dirname, "src"), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".js")) res.setHeader("Content-Type", "text/javascript");
  }
}));

// ---------- Start server ----------
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
