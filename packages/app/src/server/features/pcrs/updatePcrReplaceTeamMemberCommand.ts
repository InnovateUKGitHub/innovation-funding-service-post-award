import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrReplaceTeamMemberDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  manageTeamMemberErrorMap,
  replaceTeamMemberValidator,
} from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberCrud.zod";
import { ManageTeamMemberMethod, PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants/pcrConstants";
import { GetAllPCRItemTypesQuery } from "./getAllItemTypesQuery";

export class UpdatePcrReplaceTeamMemberCommand extends ZodAuthorisedAsyncCommandBase<
  { id: PcrId },
  typeof replaceTeamMemberValidator,
  PcrReplaceTeamMemberDto
> {
  public readonly runnableName: string = "UpdatePcrReplaceTeamMemberCommand";
  protected readonly projectId: ProjectId;
  private readonly form: FormTypes.ProjectManageTeamMembersReplace;
  protected readonly dto: PcrReplaceTeamMemberDto;

  constructor({
    projectId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    pcr: PcrReplaceTeamMemberDto;
    form: FormTypes.ProjectManageTeamMembersReplace;
  }) {
    super();
    this.projectId = projectId;
    // this.pcrId = pcrId;
    // this.pcrItemId = pcrItemId;
    this.dto = pcr;
    this.form = form;
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.MonitoringOfficer);
  }

  protected async getZodSchema() {
    return { schema: replaceTeamMemberValidator, errorMap: manageTeamMemberErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      partnerId: this.dto.partnerId,
      pclId: this.dto.pclId,
      firstName: this.dto.manageTeamMemberFirstName,
      lastName: this.dto.manageTeamMemberLastName,
      email: this.dto.manageTeamMemberEmail,
      role: this.dto.manageTeamMemberRole,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<typeof replaceTeamMemberValidator>,
  ): Promise<{ id: PcrId }> {
    const itemTypes = await context.runQuery(new GetAllPCRItemTypesQuery(this.projectId));

    const matchedItem = itemTypes.find(t => t.type === PCRItemType.ManageTeamMembers);
    if (!matchedItem) throw new Error(`cannot find item matching ${PCRItemType.ManageTeamMembers}`);
    const id = await context.repositories.projectChangeRequests.createProjectChangeRequest({
      status: PCRStatus.SubmittedToInnovateUK,
      manageTeamMemberStatus: PCRStatus.SubmittedToInnovateUK,
      reasoningStatus: PCRItemStatus.Complete,
      projectId: this.projectId,
      items: [
        {
          projectId: this.projectId,
          recordTypeId: matchedItem.recordTypeId,
          developerRecordTypeName: matchedItem.developerRecordTypeName,
          status: PCRItemStatus.Complete,
          pclId: validatedData.pclId,
          manageTeamMemberType: ManageTeamMemberMethod.REPLACE,
          manageTeamMemberFirstName: validatedData.firstName,
          manageTeamMemberLastName: validatedData.lastName,
          manageTeamMemberEmail: validatedData.email,
          manageTeamMemberRole: validatedData.role,
          partnerId: validatedData.partnerId,
        },
      ],
    });

    await context.repositories.projectContacts.update([
      {
        Id: this.dto.pclId,
        Acc_Replaced__c: true,
      },
    ]);

    return { id };
  }
}
