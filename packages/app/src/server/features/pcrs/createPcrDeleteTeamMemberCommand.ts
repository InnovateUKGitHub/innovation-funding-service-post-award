import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrDeleteTeamMemberDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  deleteTeamMemberValidator,
  manageTeamMemberErrorMap,
} from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberCrud.zod";
import { ManageTeamMemberMethod, PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants/pcrConstants";
import { GetAllPCRItemTypesQuery } from "./getAllItemTypesQuery";
import { GetAllForProjectQuery } from "../projectContacts/getAllForProjectQuery";
import { NotFoundError } from "../common/appError";

export class CreatePcrDeleteTeamMemberCommand extends ZodAuthorisedAsyncCommandBase<
  { id: PcrId },
  typeof deleteTeamMemberValidator,
  PcrDeleteTeamMemberDto
> {
  public readonly runnableName: string = "CreatePcrDeleteTeamMemberCommand";
  protected readonly projectId: ProjectId;
  private readonly form: FormTypes.ProjectManageTeamMembersDelete;
  protected readonly dto: PcrDeleteTeamMemberDto;

  constructor({
    projectId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    pcr: PcrDeleteTeamMemberDto;
    form: FormTypes.ProjectManageTeamMembersDelete;
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
    return { schema: deleteTeamMemberValidator, errorMap: manageTeamMemberErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      pclId: this.dto.pclId,
      role: this.dto.role,
      endDate: this.dto.endDate,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<typeof deleteTeamMemberValidator>,
  ): Promise<{ id: PcrId }> {
    const existingPcls = await context.runQuery(new GetAllForProjectQuery(this.projectId));

    const existingPcl = existingPcls.find(x => x.id === validatedData.pclId);

    if (!existingPcl) {
      throw new NotFoundError("Cannot find PCL");
    }

    const itemTypes = await context.runQuery(new GetAllPCRItemTypesQuery(this.projectId));

    const matchedItem = itemTypes.find(t => t.type === PCRItemType.ManageTeamMembers);
    if (!matchedItem) throw new Error(`cannot find item matching ${PCRItemType.ManageTeamMembers}`);
    const id = await context.repositories.projectChangeRequests.createProjectChangeRequest({
      status: PCRStatus.Approved,
      manageTeamMemberStatus: PCRStatus.Approved,
      reasoningStatus: PCRItemStatus.Complete,
      projectId: this.projectId,
      items: [
        {
          projectId: this.projectId,
          recordTypeId: matchedItem.recordTypeId,
          developerRecordTypeName: matchedItem.developerRecordTypeName,
          status: PCRItemStatus.Complete,
          pclId: validatedData.pclId,
          manageTeamMemberType: ManageTeamMemberMethod.DELETE,
          manageTeamMemberRole: validatedData.role,
        },
      ],
    });

    await context.repositories.projectContacts.update([
      {
        Id: this.dto.pclId,
        Acc_EndDate__c: validatedData.endDate.toISOString(),
      },
    ]);

    return { id };
  }
}
