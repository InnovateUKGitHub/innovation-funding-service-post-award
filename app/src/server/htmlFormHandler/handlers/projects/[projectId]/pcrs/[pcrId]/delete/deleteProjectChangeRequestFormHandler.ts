import { PCRDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { DeleteProjectChangeRequestCommand } from "@server/features/pcrs/deleteProjectChangeRequestCommand";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { PCRsDashboardRoute } from "@ui/containers/pages/pcrs/dashboard/PCRDashboard.page";
import { PCRDeleteParams, PCRDeleteRoute } from "@ui/containers/pages/pcrs/pcrDelete.page";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

export class ProjectChangeRequestDeleteFormHandler extends StandardFormHandlerBase<PCRDeleteParams, "pcr"> {
  constructor() {
    super(PCRDeleteRoute, ["delete"], "pcr");
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
