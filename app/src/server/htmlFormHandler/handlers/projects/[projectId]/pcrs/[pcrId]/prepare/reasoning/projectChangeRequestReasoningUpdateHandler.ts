import { PCRItemStatus, PCRItemType, PCRItemDisabledReason } from "@framework/constants/pcrConstants";
import { PCRDto, PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { ProjectChangeRequestPrepareRoute } from "@ui/containers/pages/pcrs/overview/projectChangeRequestPrepare.page";
import {
  ProjectChangeRequestPrepareReasoningParams,
  PCRPrepareReasoningRoute,
} from "@ui/containers/pages/pcrs/reasoning/pcrReasoningWorkflow.page";
import { reasoningWorkflowSteps } from "@ui/containers/pages/pcrs/reasoning/workflowMetadata";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

export class ProjectChangeRequestReasoningUpdateHandler extends StandardFormHandlerBase<
  ProjectChangeRequestPrepareReasoningParams,
  "pcr"
> {
  constructor() {
    super(PCRPrepareReasoningRoute, ["default", "filesStep", "reasoningStep"], "pcr");
  }

  protected async getDto(
    context: IContext,
    params: ProjectChangeRequestPrepareReasoningParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<PCRDto> {
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    dto.reasoningStatus = body.reasoningStatus === "true" ? PCRItemStatus.Complete : PCRItemStatus.Incomplete;

    if (button.name === "reasoningStep") {
      dto.reasoningComments = body.reasoningComments;
    }

    return dto;
  }

  protected async run(
    context: IContext,
    params: ProjectChangeRequestPrepareReasoningParams,
    button: IFormButton,
    dto: PCRDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(
      new UpdatePCRCommand({ projectId: params.projectId, projectChangeRequestId: params.pcrId, pcr: dto }),
    );

    // If on the summary
    if (!params.step) {
      // go back to the prepare page
      return ProjectChangeRequestPrepareRoute.getLink({
        projectId: params.projectId,
        pcrId: params.pcrId,
      });
    }
    // If on the last step go to the summary
    // If not on the last step go to the next step
    return PCRPrepareReasoningRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      step: params.step === reasoningWorkflowSteps.length ? undefined : params.step + 1,
    });
  }

  protected getStoreKey(params: ProjectChangeRequestPrepareReasoningParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareReasoningParams, dto: PCRDto) {
    const projectChangeRequestItemTypes: PCRItemTypeDto[] = [
      {
        type: PCRItemType.AccountNameChange,
        displayName: "",
        recordTypeId: "",
        enabled: false,
        disabled: false,
        disabledReason: PCRItemDisabledReason.None,
        files: [],
      },
    ];
    return new PCRDtoValidator({
      model: dto,
      original: dto,
      recordTypes: projectChangeRequestItemTypes,
    });
  }
}
