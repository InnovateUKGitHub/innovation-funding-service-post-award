import { CreateProjectProps, buildApex } from "@innovateuk/project-factory";
import { sleep } from "../../helpers/sleep";
import { SfdcApi } from "../sfdc/SfdcApi";
import { ProjectState } from "./ProjectState";

export abstract class ProjectFactory {
  protected readonly sfdcApi: SfdcApi;
  public static projectState: ProjectState | null;
  protected projectState: ProjectState | null;
  protected prefix: string | null = null;

  constructor({ projectState, sfdcApi }: { projectState: ProjectState; sfdcApi: SfdcApi }) {
    this.sfdcApi = sfdcApi;
    this.projectState = projectState;
  }

  protected abstract getProject(): CreateProjectProps;

  protected async createProject() {
    this.prefix = Math.floor(Date.now() / 1000).toString() + ".";

    if (ProjectFactory.projectState) {
      this.projectState = ProjectFactory.projectState;
      return;
    }

    const data = this.getProject();
    const apex = buildApex({
      instances: [
        data.project,
        ...data.projectParticipants,
        ...data.pcrs.headers,
        ...data.pcrs.removePartner,
        ...data.logins.map(x => [x.account, x.contact, x.pcl, x.user]),
        data.competition,
        ...data.profiles.projectFactoryHelpers,
        ...data.profiles.details,
        ...data.profiles.totalCostCategories,
      ].flat(),
      options: {
        prefix: this.prefix,
      },
    });

    this.projectState.prefix = this.prefix;
    this.projectState.project = {
      number: data.project.getField("Acc_ProjectNumber__c"),
      title: data.project.getField("Acc_ProjectTitle__c"),
    };
    this.projectState.usernames = data.logins.map(x => x.user.getField("Username"));
    ProjectFactory.projectState = this.projectState;
    await this.sfdcApi.runApex(apex);

    while (true) {
      try {
        // Wait until a login is successful
        await this.sfdcApi.getSalesforceToken(this.prefix + data.logins[0].user.getField("Username"));
        break;
      } catch {}
      await sleep(2000);
    }
  }
}
