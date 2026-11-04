/* ==========================================================================
   PFLEGE-DATEI – hier werden News, Öffnungszeiten und Vermietungen gepflegt.
   Nur diese Datei muss für tägliche Änderungen bearbeitet werden.
   ========================================================================== */

window.FH = {
  telefon: "0176 325 469 96",
  telefonLink: "+4917632546996",
  whatsapp: "4917632546996",
  email: "info@forellenhofmuensterland.de",

  // Öffnungszeiten. "Sommer" = April bis September, "Winter" = Oktober bis März.
  oeffnungszeiten: {
    sommer: { von: "07:00", bis: "17:00" },
    winter: { von: "08:00", bis: "17:00" }
  },

  // Ruhetage: 0 = Sonntag, 1 = Montag, 2 = Dienstag, … 5 = Freitag, 6 = Samstag
  ruhetage: [2, 5],

  // Einzelne Tage, an denen zusätzlich geschlossen ist (z. B. Feiertage), Format JJJJ-MM-TT
  geschlossenAm: [],

  // Tage, an denen Teich 2 vermietet ist (Format JJJJ-MM-TT)
  teich2Vermietet: ["2026-11-01", "2026-11-08", "2026-11-21", "2026-11-22"],

  // News für die Startseite – neueste zuerst. "wichtig: true" hebt die Meldung farbig hervor.
  // "bis" (optional): ab diesem Datum wird die Meldung automatisch ausgeblendet.
  news: [
    {
      datum: "2026-11-01",
      titel: "Preise bleiben stabil",
      text: "<p>Wir haben die Preise für Angelkarten und Mietteiche <strong>nicht erhöht</strong> – lediglich der Besatz wurde angepasst. Bei den Mietteichen können Sie gegen Aufpreis jederzeit mehr Fisch besetzen lassen:</p><ul><li>Lebende Forellen: <strong>11,25 € pro kg</strong></li><li>Lachsforellen: <strong>14,00 € pro kg</strong></li></ul>",
      wichtig: true
    },
    {
      datum: "2026-10-15",
      titel: "Teich 2 jetzt auch zu mieten",
      text: "<p>Teich 2 kann ab sofort komplett gemietet werden: <strong>450 € inkl. 40 kg Regenbogenforellen</strong>. Vermietete Tage sehen Sie im Belegungskalender und auf Facebook.</p>"
    },
    {
      datum: "2026-09-01",
      titel: "Ablauf am Morgen",
      text: "<ul><li>Bitte <strong>nicht vor dem Tor sammeln</strong> – bleiben Sie an Ihrem Auto.</li><li>Bezahlt wird in der Reihenfolge, in der Sie auf dem Parkplatz angekommen sind.</li><li>Kasse am Häuschen: dort gibt es auch Köder, Bratwurstmarken &amp; mehr.</li><li>Jeder bleibt an seinem Platz – Platzwechsel nur mit allen Angelsachen.</li><li>Jede Person am Wasser benötigt eine eigene Angelkarte.</li></ul>"
    },
    {
      datum: "2026-09-01",
      titel: "Keine Besucher und Spaziergänger",
      text: "<p>Damit unsere Angler in Ruhe angeln können, ist das Umherlaufen um die Teiche als Besucher oder Spaziergänger nicht erlaubt. Bei einer <strong>Teichmiete</strong> dürfen Sie gerne Gäste mitbringen.</p>"
    }
  ]
};
