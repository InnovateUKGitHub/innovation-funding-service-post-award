import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { CommandBase } from "../common/commandBase";
import { ProjectRole, ProjectStatus } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";
import { ActiveProjectError } from "../common/appError";
import { DateTime } from "luxon";

export class UpdateProjectContactsCommand extends CommandBase<boolean> {
  constructor(
    private readonly projectId: ProjectId,
    private readonly contacts: PickRequiredFromPartial<ProjectContactDto, "id" | "startDate">[],
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager);
  }

  protected async run(context: IContext) {
    const { status } = await context.runQuery(new GetProjectStatusQuery(this.projectId));

    if (status !== ProjectStatus.OfferLetterSent) {
      throw new ActiveProjectError();
    }

    return await context.repositories.projectContacts.update(
      this.contacts.map(x => ({
        Id: x.id,
        Acc_StartDate__c: x.startDate ? DateTime.fromJSDate(x.startDate).toFormat("yyyy-MM-dd") : null,
      })),
    );
  }
}
