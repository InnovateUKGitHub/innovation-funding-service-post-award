import { useEffect } from "react";
import { clientsideApiClient } from "@ui/apiClient";

const heartbeatDebounce = 3000;
let heartbeatTimeoutId: NodeJS.Timeout;

const sendHeartbeat = () => {
  clearTimeout(heartbeatTimeoutId);

  heartbeatTimeoutId = setTimeout(() => {
    clientsideApiClient.app.heartbeat(null);
  }, heartbeatDebounce);
};

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
