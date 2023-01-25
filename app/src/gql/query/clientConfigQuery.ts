import { graphql } from "react-relay";

const clientConfigQueryQuery = graphql`
  query clientConfigQuery {
    clientConfig {
      features {
        changePeriodLengthWorkflow
        customContent
        searchDocsMinThreshold
        futureTimeExtensionInYears
      }
      options {
        maxFileSize
        maxUploadFileCount
        permittedFileTypes
        permittedTypes {
          pdfTypes
          textTypes
          presentationTypes
          spreadsheetTypes
          imageTypes
        }
        bankCheckValidationRetries
        bankCheckAddressScorePass
        bankCheckCompanyNameScorePass
        standardOverheadRate
        numberOfProjectsToSearch
        maxClaimLineItems
        nonJsMaxClaimLineItems
      }
      ifsRoot
      ssoEnabled
      logLevel
    }
  }
`;

export { clientConfigQueryQuery };
