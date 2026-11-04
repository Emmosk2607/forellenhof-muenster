// Überträgt Kopf- und Fußbereich der index.html in alle anderen Seiten.
// Nach Änderungen an Menü/Footer in index.html einfach ausführen: node layout.js
const fs = require("fs");
const path = require("path");

const dir = __dirname;
const source = fs.readFileSync(path.join(dir, "index.html"), "utf8");
const block = (html, name) => {
  const m = html.match(new RegExp(`<!-- ${name}:START -->[\\s\\S]*?<!-- ${name}:END -->`));
  if (!m) throw new Error(`Marker ${name} fehlt`);
  return m[0];
};
const header = block(source, "HEADER");
const footer = block(source, "FOOTER");

for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".html") && f !== "index.html")) {
  const p = path.join(dir, file);
  const html = fs.readFileSync(p, "utf8");
  const out = html
    .replace(/<!-- HEADER:START -->[\s\S]*?<!-- HEADER:END -->/, () => header)
    .replace(/<!-- FOOTER:START -->[\s\S]*?<!-- FOOTER:END -->/, () => footer);
  fs.writeFileSync(p, out);
  console.log("aktualisiert:", file);
}
