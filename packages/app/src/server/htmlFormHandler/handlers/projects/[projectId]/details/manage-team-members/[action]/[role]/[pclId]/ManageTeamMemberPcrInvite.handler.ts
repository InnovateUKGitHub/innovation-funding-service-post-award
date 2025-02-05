import { ManageTeamMemberMethod, PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { IRouteDefinition } from "@ui/app/containerBase";
import {
  createTeamMemberValidator,
  manageTeamMemberErrorMap,
} from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberCrud.zod";
import { ManageTeamMembersCreateRoute } from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberCreate.page";
import { ManageTeamMemberProps } from "@ui/pages/pcrs/manageTeamMembers/ManageTeamMember.logic";
import { ProjectChangeRequestSubmittedForReviewRoute } from "@ui/pages/pcrs/submitSuccess/ProjectChangeRequestSubmittedForReview.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { GetAllPCRItemTypesQuery } from "@server/features/pcrs/getAllItemTypesQuery";

export class ManageTeamMemberPcrInviteHandler extends ZodFormHandlerBase<
  typeof createTeamMemberValidator,
  ManageTeamMemberProps
> {
  constructor() {
    super({
      routes: [ManageTeamMembersCreateRoute] as IRouteDefinition<ManageTeamMemberProps>[],
      forms: [FormTypes.ProjectManageTeamMembersCreate],
    });
  }

  public readonly acceptFiles = false;

  async getZodSchema() {
    return {
      schema: createTeamMemberValidator,
      errorMap: manageTeamMemberErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<typeof createTeamMemberValidator>> {
    return {
      form: input.form,
      partnerId: input.partnerId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      startDate: {
        day: input["startDate.day"],
        month: input["startDate.month"],
        year: input["startDate.year"],
      },
      role: input.role,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<typeof createTeamMemberValidator>;
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
          manageTeamMemberType: ManageTeamMemberMethod.CREATE,
          manageTeamMemberFirstName: input.firstName,
          manageTeamMemberLastName: input.lastName,
          manageTeamMemberEmail: input.email,
          manageTeamMemberRole: input.role,
          manageTeamMemberAssociateStartDate: input.startDate,
          partnerId: input.partnerId,
        },
      ],
    });

    return ProjectChangeRequestSubmittedForReviewRoute.getLink({ projectId: params.projectId, pcrId }).path;
  }
}
