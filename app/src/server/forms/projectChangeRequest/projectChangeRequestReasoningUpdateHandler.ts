import { IContext, ILinkInfo, PCRDto, PCRItemTypeDto, ProjectDto, ProjectRole } from "@framework/types";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  PCRPrepareReasoningRoute,
  ProjectChangeRequestPrepareReasoningParams,
  ProjectChangeRequestPrepareRoute
} from "@ui/containers";
import { PCRDtoValidator } from "@ui/validators";
import { PCRItemStatus, PCRItemType } from "@framework/constants";
import { reasoningWorkflowSteps } from "@ui/containers/pcrs/reasoning/workflowMetadata";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { Configuration } from "@server/features/common";

export class ProjectChangeRequestReasoningUpdateHandler extends StandardFormHandlerBase<ProjectChangeRequestPrepareReasoningParams, "pcr"> {
  constructor() {
    super(PCRPrepareReasoningRoute, ["default", "filesStep", "reasoningStep"], "pcr");
  }

  protected async getDto(context: IContext, params: ProjectChangeRequestPrepareReasoningParams, button: IFormButton, body: IFormBody): Promise<PCRDto> {
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    dto.reasoningStatus = body.reasoningStatus === "true" ? PCRItemStatus.Complete : PCRItemStatus.Incomplete;

    if (button.name === "reasoningStep") {
      dto.reasoningComments = body.reasoningComments;
    }

    return dto;
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareReasoningParams, button: IFormButton, dto: PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePCRCommand(params.projectId, params.pcrId, dto));

    // If on the summary
    if (!params.step) {
      // go back to the prepare page
      return ProjectChangeRequestPrepareRoute.getLink({
        projectId: params.projectId,
        pcrId: params.pcrId
      });
    }
    // If on the last step go to the summary
    // If not on the last step go to the next step
    return PCRPrepareReasoningRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      step: params.step === reasoningWorkflowSteps.length ? undefined : params.step + 1
    });
  }

  protected getStoreKey(params: ProjectChangeRequestPrepareReasoningParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareReasoningParams, dto: PCRDto) {
    const projectChangeRequestItemTypes: PCRItemTypeDto[] = [{
      type: PCRItemType.AccountNameChange,
      displayName: "",
      recordTypeId: "",
      enabled: false,
      files:[]
    }];
    return new PCRDtoValidator(dto, ProjectRole.Unknown, projectChangeRequestItemTypes, false, {} as ProjectDto, Configuration.features, dto);
  }
}
