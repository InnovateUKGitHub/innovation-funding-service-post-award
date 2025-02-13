import { AbstractSObject } from "@innovateuk/project-factory-two/sobjects/AbstractProjectFactory";
import { Acc_Project__c } from "@innovateuk/project-factory-two/sobjects/Acc_Project__c";
import { User } from "@innovateuk/project-factory-two/sobjects/User";
import { Fixture, Given } from "playwright-bdd/decorators";
import { SfdcApi } from "../sfdc/SfdcApi";

export
@Fixture("projectState")
class ProjectState {
  public context: Record<string, AbstractSObject> = {};
  private readonly sfdcApi: SfdcApi;

  constructor({ sfdcApi }: { sfdcApi: SfdcApi }) {
    this.sfdcApi = sfdcApi;
  }

  @Given("the project number is {string}")
  public setProjectNumber(number: string) {
    const project = new Acc_Project__c();
    project.Acc_ProjectNumber__c = number;
    this.context.project = project;
  }

  @Given("the username for {string} is {string}")
  public setUsername(id: string, username: string) {
    const user = new User();
    user.Username = username;
    this.context[id] = user;
  }

  prefixedProjectNumber(): string {
    const project = this.context.project;
    if (!(project instanceof Acc_Project__c)) throw new Error("Project key is not of type Acc_Project__c");
    if (!(typeof project.Acc_ProjectNumber__c === "string")) throw new Error("Project does not have a project number");
    return project.Acc_ProjectNumber__c;
  }

  moveClaim(name: string, status: string) {
    const claim = this.context.claim;
  }
}
