/* ===== Google Analytics 4 — Grupo Arvor =====
   Pegá acá tu Measurement ID (formato G-XXXXXXXXXX) UNA sola vez.
   Se usa en todas las páginas que incluyan este archivo. */
window.GA_ID = "G-YB1CKV38YP"; // <-- ID de GA4 de Grupo Arvor

(function () {
  if (!window.GA_ID || window.GA_ID.indexOf("G-") !== 0 || window.GA_ID === "G-XXXXXXXXXX") return;
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + window.GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", window.GA_ID);
})();
