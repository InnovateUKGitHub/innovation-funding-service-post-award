import { PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";
import { CreateProjectChangeRequestCommand } from "@server/features/pcrs/createProjectChangeRequestCommand";
import { UpdateProjectContactLinkCommand } from "@server/features/projectContacts/UpdateProjectContactLinkCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { IRouteDefinition } from "@ui/app/containerBase";
import {
  manageTeamMemberErrorMap,
  manageTeamMemberValidator,
  ManageTeamMemberValidatorSchema,
} from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberCrud.zod";
import { ManageTeamMembersCreateRoute } from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberCreate.page";
import { ManageTeamMembersDeleteRoute } from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberDelete.page";
import { ManageTeamMembersReplaceRoute } from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberReplace.page";
import { ManageTeamMembersUpdateRoute } from "@ui/pages/pcrs/manageTeamMembers/actions/ManageTeamMemberUpdate.page";
import { ManageTeamMemberProps } from "@ui/pages/pcrs/manageTeamMembers/ManageTeamMember.logic";
import { ProjectChangeRequestCompletedRoute } from "@ui/pages/pcrs/submitSuccess/ProjectChangeRequestCompleted.page";
import { ProjectChangeRequestSubmittedForReviewRoute } from "@ui/pages/pcrs/submitSuccess/ProjectChangeRequestSubmittedForReview.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export class ManageTeamMemberProjectChangeRequestHandler extends ZodFormHandlerBase<
  ManageTeamMemberValidatorSchema,
  ManageTeamMemberProps
> {
  constructor() {
    super({
      routes: [
        ManageTeamMembersCreateRoute,
        ManageTeamMembersReplaceRoute,
        ManageTeamMembersUpdateRoute,
        ManageTeamMembersDeleteRoute,
      ] as IRouteDefinition<ManageTeamMemberProps>[],
      forms: [
        FormTypes.ProjectManageTeamMembersCreate,
        FormTypes.ProjectManageTeamMembersReplace,
        FormTypes.ProjectManageTeamMembersUpdate,
        FormTypes.ProjectManageTeamMembersDelete,
      ],
    });
  }

  public readonly acceptFiles = false;

  async getZodSchema() {
    return {
      schema: manageTeamMemberValidator,
      errorMap: manageTeamMemberErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<ManageTeamMemberValidatorSchema>> {
    return {
      form: input.form,
      projectId: input.projectId,
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
      pclId: input.pclId,
    };
  }

  protected async run({
    input,
    context,
  }: {
    input: z.output<ManageTeamMemberValidatorSchema>;
    context: IContext;
  }): Promise<string> {
    let pcrStatus = PCRStatus.Approved;
    let pclId: ProjectContactLinkId | undefined;

    switch (input.form) {
      case FormTypes.ProjectManageTeamMembersCreate:
        {
          pcrStatus = PCRStatus.SubmittedToInnovateUK;
        }
        break;
      case FormTypes.ProjectManageTeamMembersReplace:
        {
          pcrStatus = PCRStatus.SubmittedToInnovateUK;
          await context.runCommand(
            new UpdateProjectContactLinkCommand(input.projectId, [
              {
                id: input.pclId,
                replaced: true,
              },
            ]),
          );
          pclId = input.pclId;
        }
        break;
      case FormTypes.ProjectManageTeamMembersUpdate:
        {
          await context.runCommand(
            new UpdateProjectContactLinkCommand(input.projectId, [
              {
                id: input.pclId,
                firstName: input.firstName,
                lastName: input.lastName,
                edited: true,
              },
            ]),
          );
          pclId = input.pclId;
        }
        break;

      case FormTypes.ProjectManageTeamMembersDelete:
        {
          await context.runCommand(
            new UpdateProjectContactLinkCommand(input.projectId, [
              {
                id: input.pclId,
                endDate: new Date(),
              },
            ]),
          );
          pclId = input.pclId;
        }
        break;

      default:
        throw new Error("Invalid manage team member action");
    }

    const pcrCommand = new CreateProjectChangeRequestCommand(input.projectId, {
      projectId: input.projectId,
      status: pcrStatus,
      manageTeamMemberStatus: PCRStatus.Unknown,
      reasoningStatus: PCRItemStatus.Complete,
      items: [
        {
          type: PCRItemType.ManageTeamMembers,
          status: PCRItemStatus.Complete,
          pclId,
        },
      ],
    });

    const pcrId = await context.runCommand(pcrCommand);

    switch (pcrStatus) {
      case PCRStatus.Approved:
        return ProjectChangeRequestCompletedRoute.getLink({ projectId: input.projectId, pcrId }).path;
      case PCRStatus.SubmittedToInnovateUK:
      default:
        return ProjectChangeRequestSubmittedForReviewRoute.getLink({ projectId: input.projectId, pcrId }).path;
    }
  }
}
