import { AccEnvironment, LogLevel } from "@framework/constants/enums";
import { IConfig } from "@framework/types/IConfig";

export class TestConfig implements IConfig {
  public build = {
    timestamp: Math.floor(Date.now() / 1000),
    version: `ACC-${Date.now()}`,
  };

  public salesforceQueryLimit = 195;

  public disableCsp = false;

  public timeouts = {
    costCategories: 720,
    projectRoles: 720,
    optionsLookup: 720,
    recordTypes: 720,
    cookie: 1,
    token: 1,
    contentRefreshSeconds: 0,
  };

  public certificates = {
    salesforce: "./salesforce.cert",
    saml: {
      idp: {
        public: "idp-public",
      },
      spSigning: {
        public: "sps-public",
        private: "sps-private",
      },
      spDecryption: {
        public: "spd-public",
        private: "spd-private",
      },
    },
  };

  public basicAuth = { credentials: ["bananaman:hello"] };

  public features = {
    changePeriodLengthWorkflow: false,
    customContent: true,
    approveNewSubcontractor: false,
    searchDocsMinThreshold: 3,
    futureTimeExtensionInYears: 5,
    detailedErrorSummaryComponent: true,
  };

  public logLevel = LogLevel.DEBUG;

  public options = {
    maxTotalFileSize: 100000,
    maxFileSize: 100000,
    maxUploadFileCount: 10,
    maxFileBasenameLength: 80,
    permittedTypes: {
      pdfTypes: ["pdf", "xps"],
      textTypes: ["doc", "docx", "rtf", "txt", "csv", "odt"],
      presentationTypes: ["ppt", "pptx", "odp"],
      spreadsheetTypes: ["xls", "xlsx", "ods"],
      imageTypes: ["jpg", "jpeg", "png", "odg"],
    },
    bankCheckValidationRetries: 2,
    bankCheckAddressScorePass: 6,
    bankCheckCompanyNameScorePass: 6,
    numberOfProjectsToSearch: 3,
    standardOverheadRate: 20,
    maxClaimLineItems: 120,
    nonJsMaxClaimLineItems: 10,
  };

  public salesforceServiceUser = {
    clientId: "",
    connectionUrl: "",
    serviceUsername: "",
  };

  public bankDetailsValidationUser = {
    clientId: "",
    connectionUrl: "",
    serviceUsername: "",
  };

  public sso = {
    enabled: false,
    providerUrl: "https://shibboleth.com",
    signoutUrl: "https://shibboleth.com/Logout",
  };

  public sil = {
    url: "",
  };

  public companiesHouse = {
    endpoint: "https://companiesHouse.com",
    accessToken: "companiesHouse_access_token",
  };

  public urls = {
    ifsRoot: "",
    ifsApplicationUrl: "",
    ifsGrantLetterUrl: "",
  };

  public cookie = {
    secret: "thekey",
    secure: true,
  };

  public googleTagManagerCode = "";

  public s3Account = {
    accessKeyId: "",
    secretAccessKey: "",
    contentBucket: "",
    customContentPath: "",
  };

  public accEnvironment = AccEnvironment.BASE;

  public newRelic = {
    enabled: false,
    apiKey: "",
    eventsUrl: "",
    appName: "",
  };

  public webserver = {
    port: "8080",
    url: "http://localhost:8080",
  };

  public developer = {
    writeGraphQL: false,
  };
}
