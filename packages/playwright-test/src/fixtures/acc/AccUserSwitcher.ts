import { BrowserContext, Page } from "@playwright/test";
import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectState } from "../projectFactory/ProjectState";
import { User } from "@innovateuk/project-factory-two/sobjects/User";
import { SfdcApi } from "../sfdc/SfdcApi";
import { sleep } from "../../helpers/sleep";

export
@Fixture("accUserSwitcher")
class AccUserSwitcher {
  private readonly context: BrowserContext;
  private readonly projectState: ProjectState;
  private readonly sfdcApi: SfdcApi;

  constructor({
    context,
    projectState,
    sfdcApi,
  }: {
    context: BrowserContext;
    projectState: ProjectState;
    sfdcApi: SfdcApi;
  }) {
    this.context = context;
    this.projectState = projectState;
    this.sfdcApi = sfdcApi;
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

    return this.context.setExtraHTTPHeaders({ "x-acc-userswitcher": username });
  }
}
