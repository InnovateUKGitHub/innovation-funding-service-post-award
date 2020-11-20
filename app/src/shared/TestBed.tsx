import React from "react";

import createRouter from "router5";
import browserPluginFactory from "router5/plugins/browser";
import { IFeatureFlags } from "@framework/types";
import { Content } from "@content/content";
import { ContentProvider, IStores, StoresProvider } from "@ui/redux";
import { RouterProvider } from "react-router5";

const route = { name: "test", path: "/test" } as any;
const router = createRouter([route]).usePlugin(browserPluginFactory({ useHash: false }));

export type TestBedContent = Partial<Content>;
export type TestBedStore = Partial<IStores>;

export interface ITestBedProps {
  children: React.ReactElement<{}>;
  content?: TestBedContent;
  stores?: TestBedStore;
}

// Note: When testing a component that consumes <Content />, it expects a provider to be present.
export function TestBed({ stores, content = {}, children }: ITestBedProps) {
  // TODO: Consider deep merge strategy
  const storesValue = stores || stubStores;

  return (
    <RouterProvider router={router}>
      <StoresProvider value={storesValue as any}>
        <ContentProvider value={content as any}>{children}</ContentProvider>
      </StoresProvider>
    </RouterProvider>
  );
}

// TODO: Remove when upgrading tsc > 3.5.1
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type HookTestBedProps = Omit<ITestBedProps, "children">;

export const hookTestBed = (props: HookTestBedProps) => ({
  wrapper: (wrapperProps: ITestBedProps) => <TestBed {...props} {...wrapperProps} />,
});

export const stubStores = {
  users: { getCurrentUser: () => ({ csrf: "stub-csrf" }) },
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
