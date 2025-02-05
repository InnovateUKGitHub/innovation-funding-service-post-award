import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrUpdateTeamMemberDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  manageTeamMemberErrorMap,
  updateTeamMemberValidator,
} from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberCrud.zod";
import { ManageTeamMemberMethod, PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants/pcrConstants";
import { GetAllPCRItemTypesQuery } from "./getAllItemTypesQuery";
import { GetAllForProjectQuery } from "../projectContacts/getAllForProjectQuery";
import { NotFoundError } from "../common/appError";

export class CreatePcrUpdateTeamMemberCommand extends ZodAuthorisedAsyncCommandBase<
  { id: PcrId },
  typeof updateTeamMemberValidator,
  PcrUpdateTeamMemberDto
> {
  public readonly runnableName: string = "CreatePcrUpdateTeamMemberCommand";
  protected readonly projectId: ProjectId;
  private readonly form: FormTypes.ProjectManageTeamMembersUpdate;
  protected readonly dto: PcrUpdateTeamMemberDto;

  constructor({
    projectId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    pcr: PcrUpdateTeamMemberDto;
    form: FormTypes.ProjectManageTeamMembersUpdate;
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
    return { schema: updateTeamMemberValidator, errorMap: manageTeamMemberErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      partnerId: this.dto.partnerId,
      pclId: this.dto.pclId,
      firstName: this.dto.firstName,
      lastName: this.dto.lastName,
      role: this.dto.role,
      contactId: this.dto.contactId,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<typeof updateTeamMemberValidator>,
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
          manageTeamMemberType: ManageTeamMemberMethod.UPDATE,
          manageTeamMemberFirstName: validatedData.firstName,
          manageTeamMemberLastName: validatedData.lastName,
          manageTeamMemberRole: validatedData.role,
          partnerId: validatedData.partnerId,
        },
      ],
    });

    //       id: data.pclId,
    //   firstName: data.firstName,
    //   lastName: data.lastName,
    //   edited: true,

    // await context.repositories.projectContacts.update([
    //   {
    //     Id: this.dto.pclId,
    //     // Acc_Replaced__c: true,
    //   },
    // ]);

    await context.repositories.externalContacts.update({
      Id: validatedData.contactId,
      FirstName: validatedData.firstName,
      LastName: validatedData.lastName,
    });

    return { id };
  }
}
