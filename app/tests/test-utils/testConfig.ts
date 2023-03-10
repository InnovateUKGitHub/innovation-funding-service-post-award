import { LogLevel } from "@framework/constants";
import { IConfig } from "@server/features/common";

export class TestConfig implements IConfig {
  public build = `test${Date.now()}`;

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
    shibboleth: "./shibboleth.cert",
  };

  public basicAuth = { credentials: ["bananaman:hello"] };

  public features = {
    changePeriodLengthWorkflow: false,
    customContent: true,
    searchDocsMinThreshold: 3,
    futureTimeExtensionInYears: 5,
  };

  public logLevel = LogLevel.DEBUG;

  public options = {
    maxFileSize: 100000,
    maxUploadFileCount: 10,
    permittedFileTypes: [
      "pdf",
      "xps",
      "doc",
      "docx",
      "rdf",
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
    ], // TODO: deprecated list
    permittedTypes: {}, // TODO: test when we deprecate the permittedFileTypes field
    bankCheckValidationRetries: 2,
    bankCheckPersonalDetailsScorePass: 6,
    bankCheckAddressScorePass: 6,
    bankCheckCompanyNameScorePass: 6,
    numberOfProjectsToSearch: 3,
    standardOverheadRate: 20,
    maxClaimLineItems: 120,
    nonJsMaxClaimLineItems: 10,
  };

  public prettyLogs = false;

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

  public serverUrl = "http://localhost:8080";

  public sso = {
    enabled: false,
    providerUrl: "https://shibboleth.com",
    signoutUrl: "https://shibboleth.com/Logout",
  };

  public sil = {
    bankCheckUrl: "",
    bankCheckPort: undefined,
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

  public cookieKey = "thekey";

  public googleTagManagerCode = "";

  public s3Account = {
    accessKeyId: "",
    secretAccessKey: "",
    contentBucket: "",
    customContentPath: "",
  };
}
