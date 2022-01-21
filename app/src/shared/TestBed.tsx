import createRouter from "router5";
import browserPluginFactory from "router5/plugins/browser";
import { RouterProvider } from "react-router5";
import _merge from "lodash.merge";

import { mountedContext } from "@ui/features";
import { Content } from "@content/content";
import { ContentProvider, IStores, StoresProvider } from "@ui/redux";
import React from "react";

const route = { name: "test", path: "/test" } as any;
const router = createRouter([route]).usePlugin(browserPluginFactory({ useHash: false }));

export type TestBedContent = Partial<Content>;
export type TestBedStore = Partial<IStores>;

export interface ITestBedProps {
  children: React.ReactElement<{}>;
  content?: TestBedContent;
  stores?: TestBedStore;
  isServer?: boolean;
}

// Note: When testing a component that consumes <Content />, it expects a provider to be present.
export function TestBed({ isServer = false, stores, content = {}, children }: ITestBedProps) {
  const stubStores = {
    users: {
      getCurrentUser: () => ({ csrf: "stub-csrf" }),
    },
    config: {
      getConfig: () => ({
        options: {
          maxClaimLineItems: 120,
        },
        features: {
          contentHint: false,
          searchDocsMinThreshold: 5,
        },
      }),
    },
    navigation: {
      getPageTitle: () => ({
        displayTitle: "stub-displayTitle",
      }),
    },
  } as TestBedStore;

  const storesValue = _merge(stubStores, stores);

  // Note: We need a way of upfront toggling this can use 'MountedProvider'
  const testBedMountState = { isServer, isClient: !isServer };

  return (
    <mountedContext.Provider value={testBedMountState}>
      <RouterProvider router={router}>
        <StoresProvider value={storesValue as any}>
          <ContentProvider value={content as any}>{children}</ContentProvider>
        </StoresProvider>
      </RouterProvider>
    </mountedContext.Provider>
  );
}

type HookTestBedProps = Omit<ITestBedProps, "children">;

export const hookTestBed = (props: HookTestBedProps) => ({
  wrapper: (wrapperProps: ITestBedProps) => <TestBed {...props} {...wrapperProps} />,
});

export default TestBed;
