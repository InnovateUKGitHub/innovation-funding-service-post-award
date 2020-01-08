import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { PCRsDashboardRoute, ProjectChangeRequestPrepareParams, ProjectChangeRequestPrepareRoute } from "@ui/containers";
import { PCRDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { PCRDtoValidator } from "@ui/validators";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { PCRStatus } from "@framework/constants";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class ProjectChangeRequestPrepareFormHandler extends StandardFormHandlerBase<ProjectChangeRequestPrepareParams, "pcr"> {
  constructor() {
    super(ProjectChangeRequestPrepareRoute, ["default", "return"], "pcr");
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

  protected getStoreKey(params: ProjectChangeRequestPrepareParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareParams, dto: PCRDto) {
    return new PCRDtoValidator(dto, ProjectRole.Unknown, [], false, {} as ProjectDto, dto);
  }
}
