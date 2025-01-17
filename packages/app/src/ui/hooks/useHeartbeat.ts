import { useEffect } from "react";

const heartbeatDebounceTime = 3000;
let heartbeatTimeoutId: number;

/**
 * sends a heartbeat to the server three seconds after the last keypress
 */
function sendHeartbeat() {
  window.clearTimeout(heartbeatTimeoutId);

  heartbeatTimeoutId = window.setTimeout(() => {
    fetch("/heartbeat");
  }, heartbeatDebounceTime);
}

/**
 * useHeartbeat adds event listeners to the window to send heartbeat calls.
 * Heartbeat calls serve to prevent the session from timing out while the user is
 * actively typing or clicking
 */
function useHeartbeat() {
  useEffect(() => {
    addEventListener("keydown", sendHeartbeat);
    addEventListener("click", sendHeartbeat);
    addEventListener("scrollend", sendHeartbeat);

    return () => {
      removeEventListener("keydown", sendHeartbeat);
      removeEventListener("click", sendHeartbeat);
      removeEventListener("scrollend", sendHeartbeat);
    };
  }, []);
}

export { useHeartbeat };
