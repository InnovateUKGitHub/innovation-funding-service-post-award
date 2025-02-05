import { ManageTeamMemberMethod, PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { IRouteDefinition } from "@ui/app/containerBase";
import {
  manageTeamMemberErrorMap,
  deleteTeamMemberValidator,
} from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberCrud.zod";
import { ManageTeamMembersDeleteRoute } from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberDelete.page";
import { ManageTeamMemberProps } from "@ui/pages/pcrs/manageTeamMembers/ManageTeamMember.logic";
import { ProjectChangeRequestCompletedRoute } from "@ui/pages/pcrs/submitSuccess/ProjectChangeRequestCompleted.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { GetAllForProjectQuery } from "@server/features/projectContacts/getAllForProjectQuery";
import { NotFoundError } from "@shared/appError";
import { GetAllPCRItemTypesQuery } from "@server/features/pcrs/getAllItemTypesQuery";

export class ManageTeamMemberPcrDeleteHandler extends ZodFormHandlerBase<
  typeof deleteTeamMemberValidator,
  ManageTeamMemberProps
> {
  constructor() {
    super({
      routes: [ManageTeamMembersDeleteRoute] as IRouteDefinition<ManageTeamMemberProps>[],
      forms: [FormTypes.ProjectManageTeamMembersDelete],
    });
  }

  public readonly acceptFiles = false;

  async getZodSchema() {
    return {
      schema: deleteTeamMemberValidator,
      errorMap: manageTeamMemberErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<typeof deleteTeamMemberValidator>> {
    return {
      form: input.form,
      role: input.role,
      pclId: input.pclId,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<typeof deleteTeamMemberValidator>;
    context: IContext;
    params: ManageTeamMemberProps;
  }): Promise<string> {
    const existingPcls = await context.runQuery(new GetAllForProjectQuery(params.projectId));

    const existingPcl = existingPcls.find(x => x.id === input.pclId);

    if (!existingPcl) {
      throw new NotFoundError("Cannot find PCL");
    }

    const itemTypes = await context.runQuery(new GetAllPCRItemTypesQuery(params.projectId));

    const matchedItem = itemTypes.find(t => t.type === PCRItemType.ManageTeamMembers);
    if (!matchedItem) throw new Error(`cannot find item matching ${PCRItemType.ManageTeamMembers}`);
    const pcrId = await context.repositories.projectChangeRequests.createProjectChangeRequest({
      status: PCRStatus.Approved,
      manageTeamMemberStatus: PCRStatus.Approved,
      reasoningStatus: PCRItemStatus.Complete,
      projectId: params.projectId,
      items: [
        {
          projectId: params.projectId,
          recordTypeId: matchedItem.recordTypeId,
          developerRecordTypeName: matchedItem.developerRecordTypeName,
          status: PCRItemStatus.Complete,
          pclId: input.pclId,
          manageTeamMemberType: ManageTeamMemberMethod.DELETE,
          manageTeamMemberRole: input.role,
        },
      ],
    });

    await context.repositories.projectContacts.update([
      {
        Id: input.pclId,
        Acc_EndDate__c: new Date().toISOString(),
      },
    ]);

    return ProjectChangeRequestCompletedRoute.getLink({ projectId: params.projectId, pcrId }).path;
  }
}
