import { IConfig } from "@server/features/common";
import { LogLevel } from "@framework/types/logLevel";

export class TestConfig implements IConfig {

  public build = `test${Date.now()}`;

  public timeouts = {
    costCategories: 720,
    projectRoles: 720,
    optionsLookup: 720,
    recordTypes: 720,
    cookie: 1,
    token: 1,
    contentRefreshSeconds: 0
  };

  public certificates = {
    salesforce: "./salesforce.cert",
    shibboleth: "./shibboleth.cert",
  };

  public features = {
    changePeriodLengthWorkflow: false,
    contentHint: true,
    customContent: true,
  };

  public logLevel = LogLevel.DEBUG;

  public options = {
    maxFileSize: 100000,
    maxUploadFileCount: 10,
    permittedFileTypes: ["pdf", "xps", "doc", "docx", "rdf", "txt", "csv", "odt", "ppt", "pptx", "odp", "xls", "xlsx", "ods", "jpg", "jpeg", "png"],
    bankCheckValidationRetries: 2,
    bankCheckPersonalDetailsScorePass: 6,
    bankCheckAddressScorePass: 6,
    bankCheckCompanyNameScorePass: 6,
    numberOfProjectsToSearch: 3,
    standardOverheadRate: 20,
  };

  public prettyLogs = false;

  public salesforce = {
    serivcePassword: "",
    serivceToken: "",
    clientId: "",
    connectionUrl: "",
    serivceUsername: "",
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
    companiesHouseSearchUrl: "",
    username: "",
    password: ""
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
    secretAccessKey:  "",
    contentBucket: "",
    customContentPath: "",
  };
}
