import { PCRStatus } from "@framework/constants";
import { PCRDto } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { PCRReviewParams, PCRReviewRoute, PCRsDashboardRoute } from "@ui/containers";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PCRDtoValidator } from "@ui/validators";

export class ProjectChangeRequestReviewFormHandler extends StandardFormHandlerBase<PCRReviewParams, "pcr"> {
  constructor() {
    super(PCRReviewRoute, ["default"], "pcr");
  }

  protected async getDto(
    context: IContext,
    params: PCRReviewParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<PCRDto> {
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));
    dto.comments = body.comments;
    dto.status = parseInt(body.status, 10) || PCRStatus.Unknown;

    return dto;
  }

  protected async run(
    context: IContext,
    params: PCRReviewParams,
    button: IFormButton,
    dto: PCRDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(
      new UpdatePCRCommand({ projectId: params.projectId, projectChangeRequestId: params.pcrId, pcr: dto }),
    );
    return PCRsDashboardRoute.getLink({ projectId: params.projectId });
  }

  protected getStoreKey(params: PCRReviewParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: PCRReviewParams, dto: PCRDto) {
    return new PCRDtoValidator({
      model: dto,
      original: dto,
    });
  }
}
