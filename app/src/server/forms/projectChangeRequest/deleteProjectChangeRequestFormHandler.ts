import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { PCRDeleteParams, PCRDeleteRoute, PCRsDashboardRoute, } from "@ui/containers";
import { PCRDto, ProjectRole } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { getPcrEditor } from "@ui/redux/selectors";
import { PCRDtoValidator } from "@ui/validators";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { DeleteProjectChangeRequestCommand } from "@server/features/pcrs/deleteProjectChangeRequestCommand";

export class ProjectChangeRequestDeleteFormHandler extends StandardFormHandlerBase<PCRDeleteParams, PCRDto, PCRDtoValidator> {
  constructor() {
    super(PCRDeleteRoute, ["delete"]);
  }

  protected async getDto(context: IContext, params: PCRDeleteParams, button: IFormButton, body: IFormBody): Promise<PCRDto> {
    return await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));
  }

  protected async run(context: IContext, params: PCRDeleteParams, button: IFormButton, dto: PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new DeleteProjectChangeRequestCommand(params.projectId, params.pcrId));
    return PCRsDashboardRoute.getLink({ projectId: params.projectId });
  }

  protected getStoreInfo(params: PCRDeleteParams): { key: string; store: string; } {
    return getPcrEditor(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: PCRDeleteParams, dto: PCRDto) {
    return new PCRDtoValidator(dto, ProjectRole.Unknown, [], false, dto);
  }
}
