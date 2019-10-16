import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { PCRsDashboardRoute, ProjectChangeRequestPrepareParams, ProjectChangeRequestPrepareRoute } from "@ui/containers";
import { PCRDto, ProjectRole } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { getPcrEditor } from "@ui/redux/selectors";
import { PCRDtoValidator } from "@ui/validators";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { PCRStatus } from "@framework/constants";

export class ProjectChangeRequestPrepareFormHandler extends StandardFormHandlerBase<ProjectChangeRequestPrepareParams, PCRDto, PCRDtoValidator> {
  constructor() {
    super(ProjectChangeRequestPrepareRoute, ["default", "return"]);
  }

  protected async getDto(context: IContext, params: ProjectChangeRequestPrepareParams, button: IFormButton, body: IFormBody): Promise<PCRDto> {
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));
    dto.comments = body.comments;

    if(button.name === "default") {
      dto.status = dto.status === PCRStatus.QueriedByInnovateUK ? PCRStatus.SubmittedToInnovationLead : PCRStatus.SubmittedToMonitoringOfficer;
    }

    return dto;
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareParams, button: IFormButton, dto: PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePCRCommand(params.projectId, params.pcrId, dto));
    return PCRsDashboardRoute.getLink({ projectId: params.projectId });
  }

  protected getStoreInfo(params: ProjectChangeRequestPrepareParams): { key: string; store: string; } {
    return getPcrEditor(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareParams, dto: PCRDto) {
    return new PCRDtoValidator(dto, ProjectRole.Unknown, [], false, dto);
  }
}
