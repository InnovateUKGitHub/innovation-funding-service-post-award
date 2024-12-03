import { BrowserContext, Page } from "@playwright/test";
import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectState } from "../projectFactory/ProjectState";
import { User } from "@innovateuk/project-factory-two/sobjects/User";
import { SfdcApi } from "../sfdc/SfdcApi";
import { sleep } from "../../helpers/sleep";
import { AccNavigation } from "./AccNavigation";
import { IfsAuthNavigation } from "../ifs-auth/IfsAuthNavigation";
import { IfsLoginPage } from "../ifs-auth/IfsLoginPage";
import { Environment } from "../Environment";
import { EnvironmentManager } from "@innovateuk/environment-manager";

export
@Fixture("accUserSwitcher")
class AccUserSwitcher {
  private readonly context: BrowserContext;
  private readonly projectState: ProjectState;
  private readonly sfdcApi: SfdcApi;
  private readonly accNavigation: AccNavigation;
  private readonly ifsAuthNavigation: IfsAuthNavigation;
  private readonly ifsLoginPage: IfsLoginPage;
  private readonly envman: EnvironmentManager;

  constructor({
    context,
    projectState,
    sfdcApi,
    accNavigation,
    ifsAuthNavigation,
    ifsLoginPage,
    environment,
  }: {
    context: BrowserContext;
    projectState: ProjectState;
    sfdcApi: SfdcApi;
    accNavigation: AccNavigation;
    ifsAuthNavigation: IfsAuthNavigation;
    ifsLoginPage: IfsLoginPage;
    environment: Environment;
  }) {
    this.context = context;
    this.projectState = projectState;
    this.sfdcApi = sfdcApi;
    this.accNavigation = accNavigation;
    this.ifsAuthNavigation = ifsAuthNavigation;
    this.ifsLoginPage = ifsLoginPage;
    this.envman = environment.envman;
  }

  @Given("the user is the {string} user")
  public switchToFinanceContact(userKey: "string") {
    const user = this.projectState.context[userKey];
    if (!(user instanceof User)) throw new Error(`${userKey} is not of type User.`);
    if (!(typeof user.Username === "string")) throw new Error("User does not have a username defined");

    return this.switch(user.Username);
  }

  @Given("the user is the system user")
  public switchToSystemUser() {
    return this.switch("");
  }

  private async switch(username: string = "") {
    console.log("acc user switcher", username);

    while (true) {
      try {
        // Wait until a login is successful
        await this.sfdcApi.getSalesforceToken(username);
        break;
      } catch (e) {
        console.log(e);
      }
      await sleep(2000);
    }

    switch (this.envman.getEnv("TEST_SALESFORCE_SANDBOX")) {
      case "uat":
        // Clear nav-cache to prevent going straight to pages user isn't supposed to
        this.accNavigation.clearCache();
        await this.ifsAuthNavigation.gotoLoginPage();
        await this.ifsLoginPage.login(username, this.envman.getEnv("UAT_PASSWORD"));
        break;
      default:
        await this.context.setExtraHTTPHeaders({ "x-acc-userswitcher": username });
        break;
    }

    return;
  }
}
