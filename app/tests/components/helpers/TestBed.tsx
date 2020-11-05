import React from "react";

import { Content } from "@content/content";
import { ContentProvider, IStores, StoresProvider } from "@ui/redux";
import { IFeatureFlags } from "@framework/types";

export interface ITestBedProps {
  content?: Partial<Content>;
  stores?: Partial<IStores>;
  children: React.ReactElement<{}>;
}

// Note: When testing a component that consumes <Content />, it expects a provider to be present.
export function TestBed({ content, stores, children }: ITestBedProps) {
  const storesValue = stores || stubStores;
  const contentValue = content || {};

  return (
    <StoresProvider value={storesValue as any}>
      <ContentProvider value={contentValue as any}>{children}</ContentProvider>
    </StoresProvider>
  );
}

export const stubStores = {
  config: {
    getConfig: () => ({
      features: {
        contentHint: false,
      } as IFeatureFlags,
    }),
  },
  navigation: {
    getPageTitle: () => ({
      displayTitle: "stub-displayTitle",
    }),
  },
};

export default TestBed;
