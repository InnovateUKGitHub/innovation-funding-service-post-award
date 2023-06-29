import { mountedContext } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { ReactNode } from "react";

interface IStubMountedProvider {
  mounted: boolean;
  children: ReactNode;
}

const StubMountedProvider = ({ mounted, children }: IStubMountedProvider) => (
  <mountedContext.Provider value={{ isClient: mounted, isServer: !mounted }}>{children}</mountedContext.Provider>
);

export { StubMountedProvider };
