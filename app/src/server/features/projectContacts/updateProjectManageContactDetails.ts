import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { CommandBase } from "../common/commandBase";
import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerError } from "../common/appError";
import { manageTeamMemberValidator } from "@ui/containers/pages/pcrs/manageTeamMembers/ManageTeamMember.zod";
import { FormTypes } from "@ui/zod/FormTypes";

export type ServerManageContactUpdateCommand = PickRequiredFromPartial<
  ProjectContactDto,
  "id" | "contactId" | "firstName" | "lastName"
> & { form: FormTypes };

export class UpdateProjectManageContactCommand extends CommandBase<boolean> {
  constructor(
    private readonly projectId: ProjectId,
    private readonly pcrId: PcrId,
    private readonly contact: ServerManageContactUpdateCommand,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager);
  }

  private mapToZod() {
    return {
      ...this.contact,
      pclId: this.contact.id,
      projectId: this.projectId,
    };
  }

  private getZodValidator() {
    return manageTeamMemberValidator;
  }

  protected async run(context: IContext) {
    const validation = this.getZodValidator().safeParse(this.mapToZod());

    if (!validation.success) {
      throw new ZodFormHandlerError(this.contact, validation.error.message, validation.error.issues);
    }

    const updateContactSuccess = await context.repositories.externalContacts.update({
      Id: this.contact.contactId,
      FirstName: this.contact.firstName!,
      LastName: this.contact.lastName!,
    });

    if (!updateContactSuccess) {
      return false;
    }

    await context.repositories.projectChangeRequests.updateManageTeamMemberPcr({
      id: this.pcrId,
      firstName: this.contact.firstName,
      lastName: this.contact.lastName,
    });

    return await context.repositories.projectContacts.updateContactDetails({
      Id: this.contact.id,
      Acc_Edited__c: true,
    });
  }
}
