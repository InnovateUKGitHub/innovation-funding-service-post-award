import { BrowserContext, Page } from "@playwright/test";
import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectState } from "../projectFactory/ProjectState";
import { IfsAuthLoginPage } from "../ifs/auth/pages/IfsAuthLoginPage";

export
@Fixture("accUserSwitcher")
class AccUserSwitcher {
  private readonly page: Page;
  private readonly context: BrowserContext;
  private readonly projectState: ProjectState;
  private readonly ifsAuthLoginPage: IfsAuthLoginPage;

  constructor({
    page,
    context,
    projectState,
    ifsAuthLoginPage,
  }: {
    page: Page;
    context: BrowserContext;
    projectState: ProjectState;
    ifsAuthLoginPage: IfsAuthLoginPage;
  }) {
    this.page = page;
    this.context = context;
    this.projectState = projectState;
    this.ifsAuthLoginPage = ifsAuthLoginPage;
  }

  @Given("the user is a finance contact")
  public switchToFinanceContact() {
    return this.switch(this.getUsername("fc"));
  }

  @Given("the user is a project manager")
  public switchToProjectManager() {
    return this.switch(this.getUsername("pm"));
  }

  @Given("the user is a monitoring officer")
  public switchToMonitoringOfficer() {
    return this.switch(this.getUsername("mo"));
  }

  @Given("the user is the system user")
  public switchToSystemUser() {
    return this.switch("");
  }

  private switch(username: string = "") {
    console.log("acc user switcher", username);

    switch (process.env.TEST_SALESFORCE_SANDBOX) {
      case "sysint":
      case "uat":
        return this.switchUserWithShibbolethLogin(username);
      case "prod":
        throw new Error("Refusing to test in production");
      default:
        return this.switchUserWithHttpHeader(username);
    }
  }

  private switchUserWithHttpHeader(username: string) {
    return this.context.setExtraHTTPHeaders({ "x-acc-userswitcher": username });
  }

  private async switchUserWithShibbolethLogin(username: string) {
    await this.ifsAuthLoginPage.login(username, "// TODO: Replace this password");
    await this.page.waitForTimeout(60000);
  }

  private getUsername(substr: string) {
    return this.projectState.prefix + this.projectState.usernames.find(x => x.includes(substr));
  }
}
