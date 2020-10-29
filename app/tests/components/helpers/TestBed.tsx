import React from "react";

import { Content } from "@content/content";
import { ContentProvider, StoresProvider } from "@ui/redux";

interface ITestBedProps {
  content: Partial<Content>;
  children: React.ReactElement<{}>;
}

// Note: When testing a component that consumes <Content />, it expects a provider to be present.
export function TestBed({ content, children }: ITestBedProps) {
  return (
    <StoresProvider value={stubStores as any}>
      <ContentProvider value={content as any}>{children}</ContentProvider>
    </StoresProvider>
  );
}

const stubStores = {
  config: {
    getConfig: () => ({
      features: {
        contentHint: false,
      } as IFeatureFlags,
    }),
  },
};

export default TestBed;
