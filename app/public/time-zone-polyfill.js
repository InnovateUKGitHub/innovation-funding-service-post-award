try {
  new Intl.DateTimeFormat("en", {timeZone: "Europe/London"}).resolvedOptions().timeZone === "Europe/London";
} catch (e) {
  var script = document.createElement("script");
  script.src = "/date-time-format-timezone-golden-zones-no-locale-min-1.0.21.js";
  document.head.appendChild(script);
}
