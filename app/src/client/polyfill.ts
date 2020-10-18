/**
 * handle polyfilling time-zones if required.
 * don't render react app until we're sure polyfill is done or unnecesssary
 */
export const Polyfill = () => {
  return new Promise<void>(resolve => {
    try {
      const timeZone = "Europe/London";
      const checkTZ = new Intl.DateTimeFormat("en", { timeZone }).resolvedOptions().timeZone;

      if (checkTZ === timeZone) {
        resolve();
      } else {
        throw new Error("Time Zones not available");
      }
    } catch (e) {
      const script = document.createElement("script");
      script.src = "/date-time-format-timezone-golden-zones-no-locale-min-1.0.21.js";
      document.head.appendChild(script);
    }
  });
};
