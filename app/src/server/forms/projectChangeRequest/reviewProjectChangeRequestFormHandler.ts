import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { PCRReviewParams, PCRReviewRoute, PCRsDashboardRoute, } from "@ui/containers";
import { PCRDto, ProjectRole } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { getPcrEditor } from "@ui/redux/selectors";
import { PCRDtoValidator } from "@ui/validators";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { PCRStatus } from "@framework/constants";

export class ProjectChangeRequestReviewFormHandler extends StandardFormHandlerBase<PCRReviewParams, PCRDto, PCRDtoValidator> {
  constructor() {
    super(PCRReviewRoute, ["default"]);
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

  protected getStoreInfo(params: PCRReviewParams): { key: string; store: string; } {
    return getPcrEditor(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: PCRReviewParams, dto: PCRDto) {
    return new PCRDtoValidator(dto, ProjectRole.Unknown, [], false, dto);
  }
}
