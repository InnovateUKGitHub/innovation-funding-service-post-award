import { ManageTeamMemberMethod, PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";

import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { IRouteDefinition } from "@ui/app/containerBase";
import {
  manageTeamMemberErrorMap,
  updateTeamMemberValidator,
} from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberCrud.zod";
import { ManageTeamMembersUpdateRoute } from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberUpdate.page";
import { ManageTeamMemberProps } from "@ui/pages/pcrs/manageTeamMembers/ManageTeamMember.logic";
import { ProjectChangeRequestCompletedRoute } from "@ui/pages/pcrs/submitSuccess/ProjectChangeRequestCompleted.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { GetAllForProjectQuery } from "@server/features/projectContacts/getAllForProjectQuery";
import { NotFoundError } from "@shared/appError";
import { GetAllPCRItemTypesQuery } from "@server/features/pcrs/getAllItemTypesQuery";

export class ManageTeamMemberPcrUpdateHandler extends ZodFormHandlerBase<
  typeof updateTeamMemberValidator,
  ManageTeamMemberProps
> {
  constructor() {
    super({
      routes: [ManageTeamMembersUpdateRoute] as IRouteDefinition<ManageTeamMemberProps>[],
      forms: [FormTypes.ProjectManageTeamMembersUpdate],
    });
  }

  public readonly acceptFiles = false;

  async getZodSchema() {
    return {
      schema: updateTeamMemberValidator,
      errorMap: manageTeamMemberErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<typeof updateTeamMemberValidator>> {
    return {
      contactId: input.contactId,
      form: input.form,
      partnerId: input.partnerId,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      pclId: input.pclId,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<typeof updateTeamMemberValidator>;
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
          manageTeamMemberType: ManageTeamMemberMethod.UPDATE,
          manageTeamMemberFirstName: input.firstName,
          manageTeamMemberLastName: input.lastName,
          manageTeamMemberRole: input.role,
          partnerId: input.partnerId,
        },
      ],
    });

    await context.repositories.externalContacts.update({
      Id: input.contactId,
      FirstName: input.firstName,
      LastName: input.lastName,
    });

    return ProjectChangeRequestCompletedRoute.getLink({ projectId: params.projectId, pcrId }).path;
  }
}
