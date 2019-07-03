import { IConfig } from "@server/features/common";
import { LogLevel } from "@framework/types/logLevel";

export class TestConfig implements IConfig {

  public build = `test${Date.now()}`;

  public timeouts = {
    costCategories: 720,
    projectRoles: 720,
    recordTypes: 720,
    cookie: 1,
    token: 1
  };

  public certificates = {
    salesforce: "./salesforce.cert",
    shibboleth: "./shibboleth.cert",
  };

  public features = {
    documentFiltering: true,
    monitoringReports: true,
    projectDocuments: true,
    projectFiltering: true
  };

  public logLevel = LogLevel.DEBUG;

  public maxFileSize = 100000;

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

  public urls = {
    ifsRoot: "",
    ifsApplicationUrl: "",
    ifsGrantLetterUrl: "",
  };

  public cookieKey = "thekey";

  public standardOverheadRate = 20;
}
