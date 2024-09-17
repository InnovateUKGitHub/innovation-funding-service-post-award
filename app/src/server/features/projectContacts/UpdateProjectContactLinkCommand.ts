import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ISalesforceProjectContact } from "@server/repositories/projectContactsRepository";
import { multipleContactDtoSchema } from "@ui/zod/contactSchema.zod";
import { DateTime } from "luxon";
import { InActiveProjectError, NotFoundError, ZodFormHandlerError } from "../common/appError";
import { CommandBase } from "../common/commandBase";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";
import { GetAllForProjectQuery } from "./getAllForProjectQuery";

export type ServerUpdateProjectContactsAssociateDetailsCommand = Pick<ProjectContactDto, "id"> &
  Pick<
    Partial<ProjectContactDto>,
    | "associateStartDate"
    | "email"
    | "startDate"
    | "endDate"
    | "edited"
    | "replaced"
    | "newTeamMember"
    | "sendInvitation"
    | "firstName"
    | "lastName"
  >;

export class UpdateProjectContactLinkCommand extends CommandBase<boolean> {
  constructor(
    private readonly projectId: ProjectId,
    private readonly contacts: ServerUpdateProjectContactsAssociateDetailsCommand[],
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRolePermissionBits.ProjectManager);
  }

  protected async run(context: IContext) {
    const { isActive } = await context.runQuery(new GetProjectStatusQuery(this.projectId));

    if (!isActive) {
      throw new InActiveProjectError();
    }

    const validation = multipleContactDtoSchema.safeParse({ contacts: this.contacts });

    if (!validation.success) {
      throw new ZodFormHandlerError(this.contacts, validation.error.message, validation.error.issues);
    }

    // Guard against editing non-project PCLs
    const existingPcls = await context.runQuery(new GetAllForProjectQuery(this.projectId));

    const promises: Promise<unknown>[] = [];
    const pclData: PickRequiredFromPartial<ISalesforceProjectContact, "Id">[] = [];

    for (const editDetail of this.contacts) {
      const existingPcl = existingPcls.find(x => x.id === editDetail.id);

      if (!existingPcl) {
        throw new NotFoundError("Cannot find PCL");
      }

      const partial: PickRequiredFromPartial<ISalesforceProjectContact, "Id"> = {
        Id: editDetail.id,
      };

      if (typeof editDetail.associateStartDate !== "undefined") {
        partial.Associate_Start_Date__c = editDetail.associateStartDate
          ? DateTime.fromJSDate(editDetail.associateStartDate).toFormat("yyyy-MM-dd")
          : null;
      }
      if (typeof editDetail.startDate !== "undefined") {
        partial.Acc_StartDate__c = editDetail.startDate
          ? DateTime.fromJSDate(editDetail.startDate).toFormat("yyyy-MM-dd")
          : null;
      }
      if (typeof editDetail.endDate !== "undefined") {
        partial.Acc_EndDate__c = editDetail.endDate
          ? DateTime.fromJSDate(editDetail.endDate).toFormat("yyyy-MM-dd")
          : null;
      }

      if (typeof editDetail.email !== "undefined") partial.Acc_EmailOfSFContact__c = editDetail.email;
      if (typeof editDetail.newTeamMember !== "undefined") partial.Acc_New_Team_Member__c = editDetail.newTeamMember;
      if (typeof editDetail.sendInvitation !== "undefined") partial.Acc_Send_invitation__c = editDetail.sendInvitation;
      if (typeof editDetail.edited !== "undefined") partial.Acc_Edited__c = editDetail.edited;
      if (typeof editDetail.replaced !== "undefined") partial.Acc_Replaced__c = editDetail.replaced;

      if (
        existingPcl.contactId &&
        typeof editDetail.firstName !== "undefined" &&
        typeof editDetail.lastName !== "undefined"
      ) {
        promises.push(
          context.repositories.externalContacts.update({
            Id: existingPcl.contactId,
            FirstName: editDetail.firstName,
            LastName: editDetail.lastName,
          }),
        );
      }

      pclData.push(partial);
    }

    promises.push(context.repositories.projectContacts.update(pclData));

    await Promise.all(promises);
    return true;
  }
}
