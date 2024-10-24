import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { Copy } from "@copy/Copy";
import { mountedContext } from "@ui/context/Mounted";
import { PageTitleProvider } from "@ui/hooks/page-title";
import { ContentProvider } from "@ui/context/contentProvider";
import { ClientConfigProvider } from "@ui/context/ClientConfigProvider";
import { IClientConfig } from "../types/IClientConfig";
import { AccEnvironment } from "@framework/constants/enums";
import { RenderHookOptions } from "@testing-library/react";

export interface ITestBedProps {
  children: React.ReactElement;
  competitionType?: string;
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
  competitionType,
  children,
  pageTitle = "stub-displayTitle",
  shouldOmitRouterProvider,
  extendClientConfig,
}: ITestBedProps) {
  const clientConfig = {
    features: {
      changePeriodLengthWorkflow: false,
      customContent: false,
      searchDocsMinThreshold: 9999,
      futureTimeExtensionInYears: 5,
      approveNewSubcontractor: false,
      detailedErrorSummaryComponent: true,
    },
    options: {
      maxTotalFileSize: 33554432,
      maxFileSize: 33554432,
      maxUploadFileCount: 10,
      maxFileBasenameLength: 80,
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
    developer: {
      oidc: {
        enabled: false,
      },
    },
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
          <ContentProvider value={new Copy({ competitionType })}>{children}</ContentProvider>
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

export const hookTestBed = (props: HookTestBedProps) =>
  ({
    wrapper: (wrapperProps: ITestBedProps) => <TestBed {...props} {...wrapperProps} />,
  }) as RenderHookOptions<ITestBedProps>;

export default TestBed;
