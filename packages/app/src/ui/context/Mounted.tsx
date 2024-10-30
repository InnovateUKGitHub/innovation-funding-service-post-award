import { createContext, useContext, useEffect, useState } from "react";

export interface MountedState {
  isClient: boolean;
  isServer: boolean;
}

export const mountedContext = createContext<MountedState | undefined>(undefined);

/**
 * ###useMountedState
 *
 * hook returns object with isServer and isClient boolean values
 * to show whether app is mounted in the browser (isClient: true)
 */
export function useMountedState(): MountedState {
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

/**
 * Provider for mounted context
 */
export function MountedProvider(props: MountedProviderProps) {
  const state = useMountedState();

  return <mountedContext.Provider {...props} value={state} />;
}

/**
 * ### useMounted
 *
 * returns the mountedContext state
 */
export function useMounted(): MountedState {
  const state = useContext(mountedContext);

  if (!state) throw Error("You need 'MountedProvider' in order to use this hook.");

  return state;
}

interface IsClientHocProps {
  children: (state: MountedState) => JSX.Element;
}

/**
 * Wrapper react HOC that includes the state of useMounted context
 * and passes it to argument for children
 */
export function MountedHoc({ children }: IsClientHocProps) {
  const state = useMounted();
  return children(state) ?? null;
}
