// Lokaler Vorschau-Server mit Live-Reload: node serve.js  →  http://localhost:8080
// Sobald eine Datei im Website-Ordner gespeichert wird, lädt der Browser die Seite automatisch neu.
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = process.env.PORT || 8080;
// LIVE=0 schaltet das automatische Neuladen ab (z. B. für Screenshots)
const live = process.env.LIVE !== "0";
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon"
};

// Verbundene Browser, die bei Änderungen benachrichtigt werden
const clients = new Set();
const reloadScript =
  "<script>(function(){var s=new EventSource('/__live');s.onmessage=function(){location.reload()};})();</script>";

let timer = null;
fs.watch(root, { recursive: true }, (event, file) => {
  if (!file || file.startsWith(".git")) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    console.log("geändert:", file, "→ Browser lädt neu");
    for (const res of clients) res.write("data: reload\n\n");
  }, 120);
});

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);

  if (p === "/__live") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    res.write("\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }

  if (p.endsWith("/")) p += "index.html";
  const file = path.join(root, path.normalize(p));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Nicht gefunden"); }
    const type = types[path.extname(file)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
    if (live && type.startsWith("text/html")) {
      res.end(data.toString("utf8").replace("</body>", reloadScript + "</body>"));
    } else {
      res.end(data);
    }
  });
}).listen(port, () => console.log("Vorschau mit Live-Reload: http://localhost:" + port));
