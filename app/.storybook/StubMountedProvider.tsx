import { ReactNode } from "react";
import { mountedContext } from "@ui/features";

interface IStubMountedProvider {
  mounted: boolean;
  children: ReactNode;
}

const StubMountedProvider = ({ mounted, children }: IStubMountedProvider) => (
  <mountedContext.Provider value={{ isClient: mounted, isServer: !mounted }}>{children}</mountedContext.Provider>
);

export { StubMountedProvider }
