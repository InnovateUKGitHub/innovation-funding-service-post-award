import React from "react";

import createRouter from "router5";
import browserPluginFactory from "router5/plugins/browser";
import { IFeatureFlags } from "@framework/types";
import { Content } from "@content/content";
import { ContentProvider, IStores, StoresProvider } from "@ui/redux";
import { RouterProvider } from "react-router5";

const route = { name: "test", path: "/test" } as any;
const router = createRouter([route]).usePlugin(
  browserPluginFactory({ useHash: false })
);

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
    <RouterProvider router={router}>
      <StoresProvider value={storesValue as any}>
        <ContentProvider value={contentValue as any}>
          {children}
        </ContentProvider>
      </StoresProvider>
    </RouterProvider>
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
