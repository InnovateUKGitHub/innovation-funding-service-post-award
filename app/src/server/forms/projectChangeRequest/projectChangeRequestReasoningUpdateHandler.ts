import { IContext, ILinkInfo, PCRDto, PCRItemTypeDto, ProjectRole } from "@framework/types";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { ProjectChangeRequestPrepareReasoningParams, ProjectChangeRequestPrepareReasoningRoute, ProjectChangeRequestPrepareRoute } from "@ui/containers";
import { getPcrEditor } from "@ui/redux/selectors";
import { PCRDtoValidator } from "@ui/validators";
import { PCRItemStatus, PCRItemType } from "@framework/constants";

export class ProjectChangeRequestReasoningUpdateHandler extends StandardFormHandlerBase<ProjectChangeRequestPrepareReasoningParams, PCRDto, PCRDtoValidator> {
  constructor() {
    super(ProjectChangeRequestPrepareReasoningRoute, ["default"]);
  }

  protected async getDto(context: IContext, params: ProjectChangeRequestPrepareReasoningParams, button: IFormButton, body: IFormBody): Promise<PCRDto> {
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    dto.reasoningComments = body.reasoningComments;
    dto.reasoningStatus = body.reasoningStatus === "true" ? PCRItemStatus.Complete : PCRItemStatus.Incomplete;

    return dto;
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareReasoningParams, button: IFormButton, dto: PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePCRCommand(params.projectId, params.pcrId, dto));
    return ProjectChangeRequestPrepareRoute.getLink(params);
  }

  protected getStoreInfo(params: ProjectChangeRequestPrepareReasoningParams): { key: string, store: string } {
    return getPcrEditor(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareReasoningParams, dto: PCRDto) {
    const projectChangeRequestItemTypes: PCRItemTypeDto[] = [{
      type: PCRItemType.AccountNameChange,
      displayName: "",
      recordTypeId: "",
      enabled: false,
      files:[]
    }];
    return new PCRDtoValidator(dto, ProjectRole.Unknown, projectChangeRequestItemTypes, false, dto);
  }
}
