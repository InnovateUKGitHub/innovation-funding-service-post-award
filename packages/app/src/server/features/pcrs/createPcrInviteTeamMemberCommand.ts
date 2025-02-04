import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrInviteTeamMemberDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  createTeamMemberValidator,
  manageTeamMemberErrorMap,
} from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberCrud.zod";
import { ManageTeamMemberMethod, PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants/pcrConstants";
import { GetAllPCRItemTypesQuery } from "./getAllItemTypesQuery";

export class CreatePcrInviteTeamMemberCommand extends ZodAuthorisedAsyncCommandBase<
  { id: PcrId },
  typeof createTeamMemberValidator,
  PcrInviteTeamMemberDto
> {
  public readonly runnableName: string = "CreatePcrInviteTeamMemberCommand";
  protected readonly projectId: ProjectId;
  private readonly form: FormTypes.ProjectManageTeamMembersCreate;
  protected readonly dto: PcrInviteTeamMemberDto;

  constructor({
    projectId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    pcr: PcrInviteTeamMemberDto;
    form: FormTypes.ProjectManageTeamMembersCreate;
  }) {
    super();
    this.projectId = projectId;
    this.dto = pcr;
    this.form = form;
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.MonitoringOfficer);
  }

  protected async getZodSchema() {
    return { schema: createTeamMemberValidator, errorMap: manageTeamMemberErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      partnerId: this.dto.partnerId,
      firstName: this.dto.manageTeamMemberFirstName,
      lastName: this.dto.manageTeamMemberLastName,
      email: this.dto.manageTeamMemberEmail,
      role: this.dto.manageTeamMemberRole,
      startDate: this.dto.manageTeamMemberAssociateStartDate,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<typeof createTeamMemberValidator>,
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
          manageTeamMemberType: ManageTeamMemberMethod.CREATE,
          manageTeamMemberFirstName: validatedData.firstName,
          manageTeamMemberLastName: validatedData.lastName,
          manageTeamMemberEmail: validatedData.email,
          manageTeamMemberRole: validatedData.role,
          manageTeamMemberAssociateStartDate: validatedData.startDate,
          partnerId: validatedData.partnerId,
        },
      ],
    });

    return { id };
  }
}
