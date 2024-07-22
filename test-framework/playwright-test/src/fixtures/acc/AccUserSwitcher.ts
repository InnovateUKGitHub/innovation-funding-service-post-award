import { BrowserContext, Page } from "@playwright/test";
import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectState } from "../projectFactory/ProjectState";
import { DevTools } from "../../components/DevTools";

export
@Fixture("accUserSwitcher")
class AccUserSwitcher {
  private readonly page: Page;
  private readonly context: BrowserContext;
  private readonly projectState: ProjectState;
  private readonly devtools: DevTools;

  constructor({ page, context, projectState }: { page: Page; context: BrowserContext; projectState: ProjectState }) {
    this.page = page;
    this.context = context;
    this.projectState = projectState;
    this.devtools = new DevTools({ page });
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
    return this.context.setExtraHTTPHeaders({ "x-acc-userswitcher": username });
  }

  private getUsername(substr: string) {
    return this.projectState.prefix + this.projectState.usernames.find(x => x.includes(substr));
  }
}
