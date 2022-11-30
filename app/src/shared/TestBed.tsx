import _merge from "lodash.merge";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { mountedContext } from "@ui/features";
import { PageTitleProvider } from "@ui/features/page-title";
import { Copy } from "@copy/Copy";
import { ContentProvider, IStores, StoresProvider } from "@ui/redux";
import { RelayEnvironmentProvider } from "relay-hooks";
import { getStubGraphQLEnvironment, stubGraphQLGraph } from "@gql/StubGraphQLEnvironment";

export type TestBedStore = Partial<IStores>;

export interface ITestBedProps {
  children: React.ReactElement;
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
  overlayGraph?: RecursivePartial<typeof stubGraphQLGraph>;
}

/**
 * TestBed is a component configured with all stores needed for tests to run
 *
 * Note: When testing a component that consumes <Content />, it expects a provider to be present.
 */
export function TestBed({
  isServer = false,
  stores,
  competitionType,
  children,
  pageTitle = "stub-displayTitle",
  shouldOmitRouterProvider,
  overlayGraph,
}: ITestBedProps) {
  const stubStores = {
    users: {
      getCurrentUser: () => ({ csrf: "stub-csrf" }),
    },
    navigation: {
      getPageTitle: () => ({
        displayTitle: "stub-displayTitle",
      }),
    },
  };

  const storesValue = _merge(stubStores, stores) as Required<TestBedStore>;

  // Note: We need a way of upfront toggling this can use 'MountedProvider'
  const testBedMountState = { isServer, isClient: !isServer };

  const history = createMemoryHistory();

  const Providers = (
    <RelayEnvironmentProvider environment={getStubGraphQLEnvironment(overlayGraph)}>
      <mountedContext.Provider value={testBedMountState}>
        <PageTitleProvider title={pageTitle}>
          <StoresProvider value={storesValue}>
            <ContentProvider value={new Copy(competitionType)}>{children}</ContentProvider>
          </StoresProvider>
        </PageTitleProvider>
      </mountedContext.Provider>
    </RelayEnvironmentProvider>
  );

  return shouldOmitRouterProvider ? (
    Providers
  ) : (
    <Router location={history.location} navigator={history}>
      {Providers}
    </Router>
  );
}

export type HookTestBedProps = Omit<ITestBedProps, "children">;

export const hookTestBed = (props: HookTestBedProps) => ({
  wrapper: (wrapperProps: ITestBedProps) => <TestBed {...props} {...wrapperProps} />,
});

export default TestBed;
