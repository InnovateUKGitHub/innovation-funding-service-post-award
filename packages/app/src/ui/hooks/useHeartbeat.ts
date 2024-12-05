import { useEffect } from "react";

const heartbeatDebounceTime = 3000;
let heartbeatTimeoutId: NodeJS.Timeout;

/**
 * sends a heartbeat to the server three seconds after the last keypress
 */
function sendHeartbeat() {
  clearTimeout(heartbeatTimeoutId);

  heartbeatTimeoutId = setTimeout(() => {
    fetch("/heartbeat");
  }, heartbeatDebounceTime);
}

const useHeartbeat = () => {
  useEffect(() => {
    addEventListener("keydown", sendHeartbeat);
    addEventListener("click", sendHeartbeat);

    return () => {
      removeEventListener("keydown", sendHeartbeat);
      removeEventListener("click", sendHeartbeat);
    };
  }, []);
};

export { useHeartbeat };
