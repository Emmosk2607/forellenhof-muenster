/* Forellenhof Münsterland – Seitenlogik */
(function () {
  "use strict";
  var FH = window.FH || {};
  var WOCHENTAGE = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  var MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function iso(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function minutes(hhmm) { var p = hhmm.split(":"); return +p[0] * 60 + +p[1]; }

  /* ---------- Navigation ---------- */
  var toggle = $(".nav-toggle");
  var nav = $(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      toggle.querySelector("use").setAttribute("href", "assets/icons.svg#" + (open ? "close" : "menu"));
    });
  }
  var page = location.pathname.split("/").pop() || "index.html";
  $$(".nav a").forEach(function (a) {
    if (a.getAttribute("href") === page) a.setAttribute("aria-current", "page");
  });

  /* ---------- Öffnungszeiten ---------- */
  function isSommer(d) { var m = d.getMonth(); return m >= 3 && m <= 8; }
  function zeitenFuer(d) { return isSommer(d) ? FH.oeffnungszeiten.sommer : FH.oeffnungszeiten.winter; }
  function istRuhetag(d) {
    return (FH.ruhetage || []).indexOf(d.getDay()) !== -1 || (FH.geschlossenAm || []).indexOf(iso(d)) !== -1;
  }
  function naechsterOffenerTag(d) {
    var n = new Date(d);
    for (var i = 1; i <= 14; i++) {
      n.setDate(n.getDate() + 1);
      if (!istRuhetag(n)) return n;
    }
    return null;
  }
  function status(now) {
    var z = zeitenFuer(now);
    var t = now.getHours() * 60 + now.getMinutes();
    var next;
    if (!istRuhetag(now)) {
      if (t >= minutes(z.von) && t < minutes(z.bis)) {
        var rest = minutes(z.bis) - t;
        return { state: rest <= 60 ? "soon" : "open", text: "Jetzt geöffnet · bis " + z.bis + " Uhr" };
      }
      if (t < minutes(z.von)) return { state: "soon", text: "Öffnet heute um " + z.von + " Uhr" };
    }
    next = naechsterOffenerTag(now);
    var label = istRuhetag(now) ? "Heute Ruhetag" : "Heute geschlossen";
    if (!next) return { state: "closed", text: label };
    var diff = Math.round((new Date(iso(next)) - new Date(iso(now))) / 864e5);
    var wann = diff === 1 ? "morgen" : WOCHENTAGE[next.getDay()];
    return { state: "closed", text: label + " · öffnet " + wann + " um " + zeitenFuer(next).von + " Uhr" };
  }
  function renderStatus() {
    var s = status(new Date());
    $$("[data-status]").forEach(function (el) {
      el.dataset.state = s.state;
      var t = el.querySelector(".txt") || el;
      t.textContent = s.text;
    });
  }
  renderStatus();
  setInterval(renderStatus, 60000);

  // Wochentabelle
  $$("[data-hours]").forEach(function (table) {
    var now = new Date();
    var z = zeitenFuer(now);
    var order = [1, 2, 3, 4, 5, 6, 0];
    table.innerHTML = order.map(function (dow) {
      var closed = (FH.ruhetage || []).indexOf(dow) !== -1;
      var cls = (dow === now.getDay() ? "today " : "") + (closed ? "closed" : "");
      return "<tr class='" + cls + "'><td>" + WOCHENTAGE[dow] + "</td><td>" +
        (closed ? "Ruhetag" : z.von + " – " + z.bis) + "</td></tr>";
    }).join("");
  });
  $$("[data-ruhetage]").forEach(function (el) {
    el.textContent = (FH.ruhetage || []).map(function (d) { return WOCHENTAGE[d]; }).join(" & ");
  });

  /* ---------- News ---------- */
  var newsEl = $("[data-news]");
  if (newsEl && FH.news) {
    var heute = iso(new Date());
    var items = FH.news.filter(function (n) { return !n.bis || n.bis >= heute; });
    var limit = +newsEl.dataset.news || items.length;
    newsEl.innerHTML = items.slice(0, limit).map(function (n) {
      var d = new Date(n.datum + "T12:00:00");
      return "<article class='news" + (n.wichtig ? " wichtig" : "") + "'>" +
        "<time datetime='" + n.datum + "'>" + d.getDate() + ". " + MONATE[d.getMonth()] + " " + d.getFullYear() + "</time>" +
        "<h3>" + n.titel + "</h3>" + n.text + "</article>";
    }).join("");
  }

  /* ---------- Belegungskalender Teich 2 ---------- */
  $$("[data-calendar]").forEach(function (el) {
    var booked = FH.teich2Vermietet || [];
    var now = new Date();
    var start = new Date(now.getFullYear(), now.getMonth(), 1);
    var offset = 0;
    var MAX = 5;

    function draw() {
      var m = new Date(start.getFullYear(), start.getMonth() + offset, 1);
      var days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
      var lead = (m.getDay() + 6) % 7;
      var today = iso(now);
      var html = "<div class='cal-head'><button type='button' data-prev aria-label='Vorheriger Monat'" + (offset === 0 ? " disabled" : "") + ">‹</button>" +
        "<strong>" + MONATE[m.getMonth()] + " " + m.getFullYear() + "</strong>" +
        "<button type='button' data-next aria-label='Nächster Monat'" + (offset === MAX ? " disabled" : "") + ">›</button></div>" +
        "<div class='cal-grid'>" + ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map(function (d) { return "<div class='dow'>" + d + "</div>"; }).join("");
      for (var i = 0; i < lead; i++) html += "<div></div>";
      var count = 0;
      for (var d = 1; d <= days; d++) {
        var date = new Date(m.getFullYear(), m.getMonth(), d);
        var key = iso(date);
        var cls = ["day"];
        var title = "frei";
        if (booked.indexOf(key) !== -1) { cls.push("booked"); title = "vermietet"; count++; }
        else if (istRuhetag(date)) { cls.push("rest"); title = "Ruhetag"; }
        if (key < today) cls.push("past");
        if (key === today) cls.push("today");
        html += "<div class='" + cls.join(" ") + "' title='" + d + ". " + MONATE[m.getMonth()] + ": " + title + "'>" + d + "</div>";
      }
      html += "</div><div class='cal-legend'><span><i style='background:var(--accent)'></i>Teich 2 vermietet</span>" +
        "<span><i style='background:var(--sand)'></i>frei</span><span><i style='background:#f1ece2'></i>Ruhetag</span></div>" +
        "<p class='season-note' aria-live='polite'>" + (count ? count + " Miettag" + (count > 1 ? "e" : "") + " in diesem Monat – an diesen Tagen ist Teich 2 privat vermietet." : "In diesem Monat sind noch keine Vermietungen eingetragen.") + "</p>";
      el.innerHTML = html;
      el.querySelector("[data-prev]").onclick = function () { if (offset > 0) { offset--; draw(); } };
      el.querySelector("[data-next]").onclick = function () { if (offset < MAX) { offset++; draw(); } };
    }
    draw();
  });

  /* ---------- Wetter (Open-Meteo, ohne Cookies) ---------- */
  var wetterEl = $("[data-weather]");
  if (wetterEl) {
    var CODES = {
      0: ["☀️", "Klar"], 1: ["🌤️", "Überwiegend klar"], 2: ["⛅", "Teils bewölkt"], 3: ["☁️", "Bedeckt"],
      45: ["🌫️", "Nebel"], 48: ["🌫️", "Reifnebel"], 51: ["🌦️", "Leichter Niesel"], 53: ["🌦️", "Niesel"], 55: ["🌧️", "Starker Niesel"],
      61: ["🌦️", "Leichter Regen"], 63: ["🌧️", "Regen"], 65: ["🌧️", "Starker Regen"], 66: ["🌧️", "Gefrierender Regen"], 67: ["🌧️", "Gefrierender Regen"],
      71: ["🌨️", "Leichter Schnee"], 73: ["🌨️", "Schnee"], 75: ["❄️", "Starker Schnee"], 77: ["🌨️", "Schneegriesel"],
      80: ["🌦️", "Regenschauer"], 81: ["🌧️", "Regenschauer"], 82: ["⛈️", "Heftige Schauer"], 85: ["🌨️", "Schneeschauer"], 86: ["🌨️", "Schneeschauer"],
      95: ["⛈️", "Gewitter"], 96: ["⛈️", "Gewitter mit Hagel"], 99: ["⛈️", "Gewitter mit Hagel"]
    };
    var c = function (code) { return CODES[code] || ["🌡️", "–"]; };
    fetch("https://api.open-meteo.com/v1/forecast?latitude=51.85&longitude=7.22&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=3")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (w) {
        var cur = c(w.current.weather_code);
        var days = w.daily.time.map(function (t, i) {
          var d = new Date(t + "T12:00:00");
          return "<div><strong>" + (i === 0 ? "Heute" : WOCHENTAGE[d.getDay()].slice(0, 2)) + "</strong><span>" + c(w.daily.weather_code[i])[0] + "</span>" +
            Math.round(w.daily.temperature_2m_max[i]) + "° / " + Math.round(w.daily.temperature_2m_min[i]) + "°</div>";
        }).join("");
        wetterEl.innerHTML = "<div class='weather-now'><span class='w-icon' aria-hidden='true'>" + cur[0] + "</span><div><div class='w-temp'>" +
          Math.round(w.current.temperature_2m) + " °C</div><div class='w-desc'>" + cur[1] + " · Wind " + Math.round(w.current.wind_speed_10m) + " km/h</div></div></div>" +
          "<div class='weather-days'>" + days + "</div>";
      })
      .catch(function () {
        wetterEl.innerHTML = "<p class='season-note'>Das Wetter konnte gerade nicht geladen werden.</p>";
      });
  }

  /* ---------- Karte erst nach Zustimmung laden ---------- */
  $$("[data-map]").forEach(function (box) {
    var btn = box.querySelector("button");
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = box.dataset.map;
      f.title = "Karte: Forellenhof Münsterland";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      box.innerHTML = "";
      box.appendChild(f);
    });
  });

  /* ---------- Tabs (Anfahrt) ---------- */
  $$("[role=tablist]").forEach(function (list) {
    var tabs = $$("[role=tab]", list);
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute("aria-selected", on);
          document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
        });
      });
    });
  });

  /* ---------- Anfrage-Formular → WhatsApp / E-Mail ---------- */
  var form = $("[data-request-form]");
  if (form) {
    var build = function () {
      var f = new FormData(form);
      var lines = ["Hallo Familie Timmer,", "", "Anliegen: " + f.get("anliegen")];
      if (f.get("datum")) lines.push("Wunschtermin: " + new Date(f.get("datum") + "T12:00:00").toLocaleDateString("de-DE"));
      if (f.get("personen")) lines.push("Personen / Menge: " + f.get("personen"));
      lines.push("", f.get("nachricht") || "", "", "Viele Grüße", f.get("name") || "");
      return lines.join("\n").trim();
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var via = e.submitter && e.submitter.value;
      var text = build();
      if (via === "mail") {
        location.href = "mailto:" + FH.email + "?subject=" + encodeURIComponent("Anfrage: " + new FormData(form).get("anliegen")) + "&body=" + encodeURIComponent(text);
      } else {
        window.open("https://wa.me/" + FH.whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      }
    });
    var preset = new URLSearchParams(location.search).get("anliegen");
    if (preset) {
      var sel = form.querySelector("select[name=anliegen]");
      $$("option", sel).forEach(function (o) { if (o.value === preset) sel.value = preset; });
    }
  }

  /* ---------- Jahr im Footer, Einblend-Animation ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
    }, { threshold: .12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("visible"); });
  }
})();
