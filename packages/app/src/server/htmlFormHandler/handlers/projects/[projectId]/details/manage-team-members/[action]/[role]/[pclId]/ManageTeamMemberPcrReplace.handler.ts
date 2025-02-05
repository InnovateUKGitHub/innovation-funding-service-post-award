import { ManageTeamMemberMethod, PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { IRouteDefinition } from "@ui/app/containerBase";
import {
  manageTeamMemberErrorMap,
  replaceTeamMemberValidator,
} from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberCrud.zod";
import { ManageTeamMembersReplaceRoute } from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberReplace.page";
import { ManageTeamMemberProps } from "@ui/pages/pcrs/manageTeamMembers/ManageTeamMember.logic";
import { ProjectChangeRequestSubmittedForReviewRoute } from "@ui/pages/pcrs/submitSuccess/ProjectChangeRequestSubmittedForReview.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { GetAllPCRItemTypesQuery } from "@server/features/pcrs/getAllItemTypesQuery";

export class ManageTeamMemberPcrReplaceHandler extends ZodFormHandlerBase<
  typeof replaceTeamMemberValidator,
  ManageTeamMemberProps
> {
  constructor() {
    super({
      routes: [ManageTeamMembersReplaceRoute] as IRouteDefinition<ManageTeamMemberProps>[],
      forms: [FormTypes.ProjectManageTeamMembersReplace],
    });
  }

  public readonly acceptFiles = false;

  async getZodSchema() {
    return {
      schema: replaceTeamMemberValidator,
      errorMap: manageTeamMemberErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<typeof replaceTeamMemberValidator>> {
    return {
      form: input.form,
      partnerId: input.partnerId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      role: input.role,
      pclId: input.pclId,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<typeof replaceTeamMemberValidator>;
    context: IContext;
    params: ManageTeamMemberProps;
  }): Promise<string> {
    const itemTypes = await context.runQuery(new GetAllPCRItemTypesQuery(params.projectId));

    const matchedItem = itemTypes.find(t => t.type === PCRItemType.ManageTeamMembers);
    if (!matchedItem) throw new Error(`cannot find item matching ${PCRItemType.ManageTeamMembers}`);
    const pcrId = await context.repositories.projectChangeRequests.createProjectChangeRequest({
      status: PCRStatus.SubmittedToInnovateUK,
      manageTeamMemberStatus: PCRStatus.SubmittedToInnovateUK,
      reasoningStatus: PCRItemStatus.Complete,
      projectId: params.projectId,
      items: [
        {
          projectId: params.projectId,
          recordTypeId: matchedItem.recordTypeId,
          developerRecordTypeName: matchedItem.developerRecordTypeName,
          status: PCRItemStatus.Complete,
          pclId: input.pclId,
          manageTeamMemberType: ManageTeamMemberMethod.REPLACE,
          manageTeamMemberFirstName: input.firstName,
          manageTeamMemberLastName: input.lastName,
          manageTeamMemberEmail: input.email,
          manageTeamMemberRole: input.role,
          partnerId: input.partnerId,
        },
      ],
    });

    await context.repositories.projectContacts.update([
      {
        Id: input.pclId,
        Acc_Replaced__c: true,
      },
    ]);

    return ProjectChangeRequestSubmittedForReviewRoute.getLink({ projectId: params.projectId, pcrId }).path;
  }
}
