import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { AuthorisedAsyncCommandBase } from "../common/commandBase";
import { ProjectRole, ProjectStatus } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";
import { ActiveProjectError, ZodFormHandlerError } from "../common/appError";
import { DateTime } from "luxon";
import { multipleContactDtoSchema } from "@ui/zod/contactSchema.zod";

export class UpdateProjectContactsCommand extends AuthorisedAsyncCommandBase<boolean> {
  public readonly runnableName: string = "UpdateProjectContactsCommand";
  constructor(
    private readonly projectId: ProjectId,
    private readonly contacts: PickRequiredFromPartial<ProjectContactDto, "id" | "associateStartDate">[],
  ) {
    super();
  }

  async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager);
  }

  protected async run(context: IContext) {
    const { status } = await context.runQuery(new GetProjectStatusQuery(this.projectId));

    if (status !== ProjectStatus.OfferLetterSent) {
      throw new ActiveProjectError();
    }

    const validation = multipleContactDtoSchema.safeParse({ contacts: this.contacts });

    if (!validation.success) {
      throw new ZodFormHandlerError(this.contacts, validation.error.message, validation.error.issues);
    }

    return await context.repositories.projectContacts.update(
      this.contacts.map(x => ({
        Id: x.id,
        Associate_Start_Date__c: x.associateStartDate
          ? DateTime.fromJSDate(x.associateStartDate).toFormat("yyyy-MM-dd")
          : null,
      })),
    );
  }
}
