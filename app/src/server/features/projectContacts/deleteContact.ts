import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { CommandBase } from "../common/commandBase";
import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { Clock } from "@framework/util/clock";
import { ZodFormHandlerError } from "../common/appError";
import { manageTeamMemberValidator } from "@ui/containers/pages/pcrs/manageTeamMembers/ManageTeamMember.zod";
import { FormTypes } from "@ui/zod/FormTypes";

export type DeleteContactCommandContactParams = PickRequiredFromPartial<ProjectContactDto, "id"> & { form: FormTypes };

export class DeleteContactCommand extends CommandBase<boolean> {
  constructor(
    private readonly projectId: ProjectId,
    private readonly contact: DeleteContactCommandContactParams,
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

    const clock = new Clock();
    const inactivationDate = clock.formatRequiredSalesforceDate(clock.now());

    return await context.repositories.projectContacts.deleteContact({
      Id: this.contact.id,
      Acc_Inactive__c: true,
      Acc_EndDate__c: inactivationDate,
    });
  }
}
