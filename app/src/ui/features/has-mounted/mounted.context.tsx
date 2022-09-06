import { createContext, useContext, useEffect, useState } from "react";

export interface MountedState {
  isClient: boolean;
  isServer: boolean;
}

export const mountedContext = createContext<MountedState | undefined>(undefined);

function useMountedContext(): MountedState {
  const state = useContext(mountedContext);

  if (!state) throw Error("You need 'MountedProvider' in order to use this hook.");

  return state;
}

interface MountedProviderProps {}

export function MountedProvider(props: MountedProviderProps) {
  const state = useMountedContext();

  return <mountedContext.Provider {...props} value={state} />;
}

export function useMounted(): MountedState {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    isServer: !mounted,
    isClient: mounted,
  };
}
