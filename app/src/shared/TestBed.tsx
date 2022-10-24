import _merge from "lodash.merge";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { mountedContext } from "@ui/features";
import { PageTitleProvider } from "@ui/features/page-title";
import { Copy } from "@copy/Copy";
import { ContentProvider, IStores, StoresProvider } from "@ui/redux";

export type TestBedStore = Partial<IStores>;

export interface ITestBedProps {
  children: React.ReactElement<{}>;
  competitionType?: string;
  stores?: TestBedStore;
  isServer?: boolean;
  pageTitle?: string;
  /**
   * `shouldOmitRouterProvider` will prevent a router provider being added to the test bed.
   * Because there can only be one router provider in the tree, it may happen that in
   * some cases there will need to be a separate router provider, in which case pass this flag
   * in to enable building.
   */
  shouldOmitRouterProvider?: boolean;
}

// Note: When testing a component that consumes <Content />, it expects a provider to be present.
export function TestBed({
  isServer = false,
  stores,
  competitionType,
  children,
  pageTitle = "stub-displayTitle",
  shouldOmitRouterProvider,
}: ITestBedProps) {
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
  } as unknown as TestBedStore;

  const storesValue = _merge(stubStores, stores);

  // Note: We need a way of upfront toggling this can use 'MountedProvider'
  const testBedMountState = { isServer, isClient: !isServer };

  const history = createMemoryHistory();

  const Providers = (
    <mountedContext.Provider value={testBedMountState}>
      <PageTitleProvider title={pageTitle}>
        <StoresProvider value={storesValue as any}>
          <ContentProvider value={new Copy(competitionType)}>{children}</ContentProvider>
        </StoresProvider>
      </PageTitleProvider>
    </mountedContext.Provider>
  );

  return shouldOmitRouterProvider ? (
    Providers
  ) : (
    <Router location={history.location} navigator={history}>
      {Providers}
    </Router>
  );
}

type HookTestBedProps = Omit<ITestBedProps, "children">;

export const hookTestBed = (props: HookTestBedProps) => ({
  wrapper: (wrapperProps: ITestBedProps) => <TestBed {...props} {...wrapperProps} />,
});

export default TestBed;
