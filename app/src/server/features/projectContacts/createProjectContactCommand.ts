import { ProjectRole, ProjectStatus } from "@framework/constants/project";
import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { contactDtoSchema } from "@ui/zod/contactSchema.zod";
import { ActiveProjectError, ZodFormHandlerError } from "../common/appError";
import { AuthorisedAsyncCommandBase } from "../common/commandBase";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";

export type ServerCreateProjectContactsCommandContact = PickRequiredFromPartial<
  ProjectContactDto,
  "id" | "email" | "accountId" | "role"
>;

export class CreateProjectContactCommand extends AuthorisedAsyncCommandBase<ProjectContactLinkId> {
  public runnableName = "CreateProjectContactCommand";

  constructor(
    private readonly projectId: ProjectId,
    private readonly contact: ServerCreateProjectContactsCommandContact,
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

    const validation = contactDtoSchema.safeParse(this.contact);

    if (!validation.success) {
      throw new ZodFormHandlerError(this.contact, validation.error.message, validation.error.issues);
    }

    return await context.repositories.projectContacts.insert({
      Acc_AccountId__c: this.contact.accountId,
      Acc_EmailOfSFContact__c: this.contact.email,
      Acc_ProjectId__c: this.projectId,
      Acc_Role__c: this.contact.role,
    });
  }
}
