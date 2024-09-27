import { PCRStatus } from "@framework/constants/pcrConstants";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { PCRsDashboardRoute } from "@ui/pages/pcrs/dashboard/PCRDashboard.page";
import { PCRReviewParams, PCRReviewRoute } from "@ui/pages/pcrs/pcrReview";
import { storeKeys } from "@server/features/common/storeKeys";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

export class ProjectChangeRequestReviewFormHandler extends StandardFormHandlerBase<PCRReviewParams, PCRDto> {
  constructor() {
    super(PCRReviewRoute, ["default"]);
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
