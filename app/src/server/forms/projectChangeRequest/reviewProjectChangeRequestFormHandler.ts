import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { PCRReviewParams, PCRReviewRoute, PCRsDashboardRoute, } from "@ui/containers";
import { Configuration } from "@server/features/common";
import { PCRDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { PCRDtoValidator } from "@ui/validators";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { PCRStatus } from "@framework/constants";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class ProjectChangeRequestReviewFormHandler extends StandardFormHandlerBase<PCRReviewParams, "pcr"> {
  constructor() {
    super(PCRReviewRoute, ["default"], "pcr");
  }

  protected async getDto(context: IContext, params: PCRReviewParams, button: IFormButton, body: IFormBody): Promise<PCRDto> {
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));
    dto.comments = body.comments;
    dto.status = parseInt(body.status, 10) || PCRStatus.Unknown;

    return dto;
  }

  protected async run(context: IContext, params: PCRReviewParams, button: IFormButton, dto: PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePCRCommand(params.projectId, params.pcrId, dto));
    return PCRsDashboardRoute.getLink({ projectId: params.projectId });
  }

  protected getStoreKey(params: PCRReviewParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: PCRReviewParams, dto: PCRDto) {
    return new PCRDtoValidator(dto, ProjectRole.Unknown, [], false, {} as ProjectDto, Configuration.features, dto);
  }
}
