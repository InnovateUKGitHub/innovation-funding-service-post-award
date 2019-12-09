import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { PCRDeleteParams, PCRDeleteRoute, PCRsDashboardRoute, } from "@ui/containers";
import { PCRDto, ProjectRole } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { PCRDtoValidator } from "@ui/validators";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { DeleteProjectChangeRequestCommand } from "@server/features/pcrs/deleteProjectChangeRequestCommand";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class ProjectChangeRequestDeleteFormHandler extends StandardFormHandlerBase<PCRDeleteParams, "pcr"> {
  constructor() {
    super(PCRDeleteRoute, ["delete"], "pcr");
  }

  protected async getDto(context: IContext, params: PCRDeleteParams, button: IFormButton, body: IFormBody): Promise<PCRDto> {
    return await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));
  }

  protected async run(context: IContext, params: PCRDeleteParams, button: IFormButton, dto: PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new DeleteProjectChangeRequestCommand(params.projectId, params.pcrId));
    return PCRsDashboardRoute.getLink({ projectId: params.projectId });
  }

  protected getStoreKey(params: PCRDeleteParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: PCRDeleteParams, dto: PCRDto) {
    return new PCRDtoValidator(dto, ProjectRole.Unknown, [], false, dto);
  }
}
