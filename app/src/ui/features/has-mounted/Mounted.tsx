import { createContext, useContext, useEffect, useState } from "react";

import { MountedState } from "./mounted.context";

export const mountedContext = createContext<MountedState | undefined>(undefined);

function useMountedState(): MountedState {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    isServer: !mounted,
    isClient: mounted,
  };
}

interface MountedProviderProps {
  children: React.ReactElement;
}

export function MountedProvider(props: MountedProviderProps) {
  const state = useMountedState();

  return <mountedContext.Provider {...props} value={state} />;
}

export function useMounted(): MountedState {
  const state = useContext(mountedContext);

  if (!state) throw Error("You need 'MountedProvider' in order to use this hook.");

  return state;
}

interface IsClientHocProps {
  children: (state: MountedState) => JSX.Element;
}

export function MountedHoc({ children }: IsClientHocProps) {
  const state = useMounted();
  return children(state) ?? null;
}
