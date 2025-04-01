import { useEffect, useState } from "react";

const useLocalStorage = <T>(channel: string, defaultValue: T) => {
  const getGlobalState = (): T | null => {
    if (typeof globalThis.localStorage === "undefined") return null;

    const val = localStorage.getItem(channel);

    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {}
    }

    return null;
  };

  const [state, setState] = useState<T>(getGlobalState() ?? defaultValue);

  const setGlobalState = (value: T) => {
    setTimeout(() => {
      setState(value);
      localStorage.setItem(channel, JSON.stringify(value));
    }, 0);
  };

  useEffect(() => {
    setState(getGlobalState() ?? defaultValue);

    const listener = (e: StorageEvent) => {
      if (e.key === channel) setState(JSON.parse(e.newValue ?? "") as T);
    };

    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener("storage", listener);
    };
  }, [setGlobalState, getGlobalState]);

  return [state, setGlobalState] as const;
};

export { useLocalStorage };
