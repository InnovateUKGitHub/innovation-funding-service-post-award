import merge from "lodash.merge";
import { Environment, Network, RecordSource, Store } from "relay-runtime";

const stubGraphQLGraph = {
  data: {
    clientConfig: {
      features: {
        changePeriodLengthWorkflow: false,
        contentHint: false,
        customContent: false,
        displayOtherContacts: true,
        searchDocsMinThreshold: 9999,
        futureTimeExtensionInYears: 5,
      },
      options: {
        maxFileSize: 33554432,
        maxUploadFileCount: 10,
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
    },
  },
};

const getStubGraphQLEnvironment = (overlayGraph: RecursivePartial<typeof stubGraphQLGraph> = {}) => {
  const source = new RecordSource();
  const store = new Store(source);

  const StubGraphQLEnvironment = new Environment({
    network: Network.create(() => merge(stubGraphQLGraph, overlayGraph)),
    store,
  });

  return StubGraphQLEnvironment;
};

export { getStubGraphQLEnvironment };
export { stubGraphQLGraph };
