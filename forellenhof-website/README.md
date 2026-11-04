# Forellenhof Münsterland – neue Website

Statische Website (HTML, CSS und JavaScript). Sie läuft ohne CMS und ohne Datenbank und kann bei jedem Webhoster liegen (z. B. IONOS).

## Live-Vorschau
Doppelklick auf `Vorschau-starten.bat` im Projektordner (oder `node serve.js` im Website-Ordner). Die Seite öffnet sich unter http://localhost:8080 und **lädt bei jeder gespeicherten Änderung automatisch neu**. Das Fenster offen lassen, zum Beenden schließen.

## Seiten
| Datei | Inhalt |
|---|---|
| index.html | Startseite: News, Live-Öffnungsstatus, Belegungskalender Teich 2, Wetter |
| preise.html | Teich 1 & 2 (Tageskarten), Mietteiche 3, 4 L/R, 5, Zusatzbesatz |
| hofladen.html | Frischer Fisch, Räucherfisch, Getränke, Snacks, Köder |
| raeucherfisch.html | Räucherfisch je 100 g, Weihnachtsbestellungen, Fischplatten |
| teichordnung.html | Übersicht „Erlaubt/Verboten“ und die vollständige Teichordnung |
| anfahrt.html | Karte (erst nach Klick), Route, 3 Wegbeschreibungen |
| ueber-uns.html | Geschichte, Fischarten |
| kontakt.html | Kontaktwege und Anfrageformular, das die Nachricht in WhatsApp oder im E-Mail-Programm öffnet |
| impressum.html, datenschutz.html | Rechtstexte (Entwurf) |

## Tägliche Pflege: nur `assets/daten.js` bearbeiten
- **News**: Einträge in `news` hinzufügen oder löschen. Mit `bis: "JJJJ-MM-TT"` wird eine Meldung ab diesem Datum automatisch ausgeblendet.
- **Teich 2 vermietet**: Daten in `teich2Vermietet` eintragen. Der Kalender aktualisiert sich dann von selbst.
- **Ruhetage, Feiertage und Öffnungszeiten**: `ruhetage`, `geschlossenAm`, `oeffnungszeiten`.

## Menü oder Footer ändern
Nur in `index.html` zwischen den Markern `HEADER:START/END` bzw. `FOOTER:START/END` ändern und danach ausführen:
```
node layout.js
```
Das Skript überträgt die Änderung in alle anderen Seiten.

## Vor dem Livegang erledigen
1. **Ruhetag klären**: Die alte Seite nennt sowohl „Dienstag“ als auch „Dienstag und Freitag“. Zurzeit ist `[2, 5]` (Di & Fr) eingestellt. Bei Bedarf auch die Öffnungszeiten im JSON-LD in `index.html` anpassen.
2. **Bildrechte** für die Fotos in `img/` mit dem Fotografen klären (die Fotos stammen von der alten Seite).
3. **SSL/HTTPS** bei IONOS aktivieren.
4. **Weiterleitungen (301)** von den alten Joomla-URLs einrichten, z. B. per `.htaccess`:
   ```
   Redirect 301 /index.php/preise.html /preise.html
   Redirect 301 /index.php/hofladen.html /hofladen.html
   Redirect 301 /index.php/raecherfisch-fischplatten.html /raeucherfisch.html
   Redirect 301 /index.php/teichordnung.html /teichordnung.html
   Redirect 301 /index.php/anfahrt.html /anfahrt.html
   Redirect 301 /index.php/ueber-uns.html /ueber-uns.html
   Redirect 301 /index.php/kontakt.html /kontakt.html
   Redirect 301 /index.php/impressum.html /impressum.html
   Redirect 301 /index.php/datenschutz.html /datenschutz.html
   ```
5. **Impressum und Datenschutz** rechtlich prüfen lassen: vollständiger Name des Inhabers, Rechtsform.
6. **Fehlende Preise** ergänzen (Saibling, Stör, Wels) sowie den Besatz von Teich 5.
7. **News-Daten** in `daten.js` prüfen. Die alte Seite hatte keine Datumsangaben, die eingetragenen Daten sind Platzhalter.
8. **Vorschau-Sperre entfernen:** In allen Seiten die Zeile `<meta name="robots" content="noindex, nofollow">` löschen (bei Impressum und Datenschutz durch `noindex, follow` ersetzen), damit Google die Seite aufnimmt.
9. Optional: `sitemap.xml` anlegen und das Google-Unternehmensprofil abgleichen.

## Nach Änderungen an CSS oder JavaScript
In allen HTML-Dateien die Versionsnummer hinter `style.css?v=…`, `daten.js?v=…` und `main.js?v=…` erhöhen, damit Browser keine alte Version aus dem Cache verwenden.
