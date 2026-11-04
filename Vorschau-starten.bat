@echo off
rem Startet die Live-Vorschau der Website und öffnet sie im Browser.
rem Jede gespeicherte Änderung erscheint sofort – Fenster offen lassen, zum Beenden schließen.
cd /d "%~dp0forellenhof-website"
start "" http://localhost:8080
node serve.js
pause
