import { useClientConfig } from "@ui/context/ClientConfigProvider";
import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useUserContext } from "@ui/context/user";

const useSessionTimeout = () => {
  const [timeoutTimestamp, setTimeoutTimestamp] = useLocalStorage<number>("acc-timeout", Number.MAX_SAFE_INTEGER);
  const config = useClientConfig();
  const user = useUserContext();

  const { timeoutMillis, warningMillis } = useMemo(() => {
    if (config.timeouts.clientside <= 0 || user.email === "") {
      return {
        timeoutMillis: Infinity,
        warningMillis: Infinity,
      };
    }

    return {
      timeoutMillis: config.timeouts.clientside * 60 * 1000,
      warningMillis: config.timeouts.clientsideWarning * 60 * 1000,
    };
  }, [config]);

  const extendTimeout = useCallback(() => {
    if (user.email !== "") setTimeoutTimestamp(Date.now() + timeoutMillis);
  }, [setTimeoutTimestamp, timeoutMillis]);

  const getTimeout = useCallback(() => {
    if (user.email === "") return { timeTillTimeout: Infinity };
    return { timeTillTimeout: timeoutTimestamp - Date.now() };
  }, [timeoutTimestamp, timeoutMillis, warningMillis]);

  return { extendTimeout, timeoutTimestamp, getTimeout, timeoutMillis, warningMillis };
};

export { useSessionTimeout };
