import { mountedContext } from "@ui/features/has-mounted/Mounted";
import { ReactNode } from "react";

interface IStubMountedProvider {
  mounted: boolean;
  children: ReactNode;
}

const StubMountedProvider = ({ mounted, children }: IStubMountedProvider) => (
  <mountedContext.Provider value={{ isClient: mounted, isServer: !mounted }}>{children}</mountedContext.Provider>
);

export { StubMountedProvider };
