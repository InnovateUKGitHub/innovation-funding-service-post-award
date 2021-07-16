import createRouter from "router5";
import browserPluginFactory from "router5/plugins/browser";
import { RouterProvider } from "react-router5";
import _merge from "lodash.merge";

import { Content } from "@content/content";
import { ContentProvider, IStores, StoresProvider } from "@ui/redux";

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
  const stubStores = {
    users: {
      getCurrentUser: () => ({ csrf: "stub-csrf" }),
    },
    config: {
      getConfig: () => ({
        options: {
          maxClaimLineItems: 120
        },
        features: {
          contentHint: false,
        },
      }),
      isClient: () => true,
    },
    navigation: {
      getPageTitle: () => ({
        displayTitle: "stub-displayTitle",
      }),
    },
  } as TestBedStore;

  const storesValue = _merge(stubStores, stores);

  return (
    <RouterProvider router={router}>
      <StoresProvider value={storesValue as any}>
        <ContentProvider value={content as any}>{children}</ContentProvider>
      </StoresProvider>
    </RouterProvider>
  );
}

type HookTestBedProps = Omit<ITestBedProps, "children">;

export const hookTestBed = (props: HookTestBedProps) => ({
  wrapper: (wrapperProps: ITestBedProps) => <TestBed {...props} {...wrapperProps} />,
});

export default TestBed;
