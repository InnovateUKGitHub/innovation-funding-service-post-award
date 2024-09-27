import { PCRDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { DeleteProjectChangeRequestCommand } from "@server/features/pcrs/deleteProjectChangeRequestCommand";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { PCRsDashboardRoute } from "@ui/pages/pcrs/dashboard/PCRDashboard.page";
import { PCRDeleteParams, PCRDeleteRoute } from "@ui/pages/pcrs/pcrDelete.page";
import { storeKeys } from "@server/features/common/storeKeys";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

export class ProjectChangeRequestDeleteFormHandler extends StandardFormHandlerBase<PCRDeleteParams, PCRDto> {
  constructor() {
    super(PCRDeleteRoute, ["delete"]);
  }

  protected async getDto(context: IContext, params: PCRDeleteParams): Promise<PCRDto> {
    return await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));
  }

  protected async run(context: IContext, params: PCRDeleteParams): Promise<ILinkInfo> {
    await context.runCommand(new DeleteProjectChangeRequestCommand(params.projectId, params.pcrId));
    return PCRsDashboardRoute.getLink({ projectId: params.projectId });
  }

  protected getStoreKey(params: PCRDeleteParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: PCRDeleteParams, dto: PCRDto) {
    return new PCRDtoValidator({
      model: dto,
      original: dto,
    });
  }
}
