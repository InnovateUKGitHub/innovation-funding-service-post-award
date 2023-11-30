import { createMemoryHistory } from "history";
import _merge from "lodash.merge";
import { Router } from "react-router-dom";
import { Copy } from "@copy/Copy";
import { mountedContext } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { PageTitleProvider } from "@ui/features/page-title";
import { ContentProvider } from "@ui/redux/contentProvider";
import { IStores, StoresProvider } from "@ui/redux/storesProvider";
import { ClientConfigProvider } from "@ui/components/providers/ClientConfigProvider";
import { IClientConfig } from "src/types/IClientConfig";
import { AccEnvironment } from "@framework/constants/enums";

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
  extendClientConfig?: (config: RecursiveMutable<IClientConfig>) => void;
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
  extendClientConfig,
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

  const clientConfig = {
    features: {
      changePeriodLengthWorkflow: false,
      customContent: false,
      searchDocsMinThreshold: 9999,
      futureTimeExtensionInYears: 5,
    },
    options: {
      maxFileSize: 33554432,
      maxUploadFileCount: 10,
      maxFileBasenameLength: 80,
      permittedFileTypes: [
        "pdf",
        "xps",
        "doc",
        "docx",
        "rtf",
        "txt",
        "csv",
        "odt",
        "ppt",
        "pptx",
        "odp",
        "xls",
        "xlsx",
        "ods",
        "jpg",
        "jpeg",
        "png",
        "odg",
      ],
      permittedTypes: {
        pdfTypes: ["pdf", "xps"],
        textTypes: ["doc", "docx", "rtf", "txt", "csv", "odt"],
        presentationTypes: ["ppt", "pptx", "odp"],
        spreadsheetTypes: ["xls", "xlsx", "ods"],
        imageTypes: ["jpg", "jpeg", "png", "odg"],
      },
      bankCheckValidationRetries: 3,
      bankCheckAddressScorePass: 6,
      bankCheckCompanyNameScorePass: 6,
      standardOverheadRate: 20,
      numberOfProjectsToSearch: 3,
      maxClaimLineItems: 120,
      nonJsMaxClaimLineItems: 10,
    },
    ifsRoot: "https://ifs-accdev.apps.ocp4.org.innovateuk.ukri.org",
    ssoEnabled: false,
    logLevel: "VERBOSE",
    accEnvironment: AccEnvironment.BASE,
  };

  // Modify the clientConfig if the TextBed wants to.
  extendClientConfig?.(clientConfig);

  // Note: We need a way of upfront toggling this can use 'MountedProvider'
  const testBedMountState = { isServer, isClient: !isServer };

  const history = createMemoryHistory();

  const Providers = (
    <mountedContext.Provider value={testBedMountState}>
      <ClientConfigProvider config={clientConfig}>
        <PageTitleProvider title={pageTitle}>
          <StoresProvider value={storesValue}>
            <ContentProvider value={new Copy({ competitionType })}>{children}</ContentProvider>
          </StoresProvider>
        </PageTitleProvider>
      </ClientConfigProvider>
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

export type HookTestBedProps = Omit<ITestBedProps, "children">;

export const hookTestBed = (props: HookTestBedProps) => ({
  wrapper: (wrapperProps: ITestBedProps) => <TestBed {...props} {...wrapperProps} />,
});

export default TestBed;
