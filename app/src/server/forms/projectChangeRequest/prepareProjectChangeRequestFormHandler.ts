import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  PCRsDashboardRoute,
  ProjectChangeRequestPrepareParams,
  ProjectChangeRequestPrepareRoute,
} from "@ui/containers";
import { PCRDto, ProjectDto } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { PCRDtoValidator } from "@ui/validators";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { PCRStatus, ProjectMonitoringLevel, ProjectRole } from "@framework/constants";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { GetByIdQuery } from "@server/features/projects";

export class ProjectChangeRequestPrepareFormHandler extends StandardFormHandlerBase<
  ProjectChangeRequestPrepareParams,
  "pcr"
> {
  constructor() {
    super(ProjectChangeRequestPrepareRoute, ["default", "return"], "pcr");
  }

  protected async getDto(
    context: IContext,
    params: ProjectChangeRequestPrepareParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<PCRDto> {
    const [pcr, project] = await Promise.all([
      context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId)),
      context.runQuery(new GetByIdQuery(params.projectId)),
    ]);
    pcr.comments = body.comments;

    if (button.name === "default") {
      switch (pcr.status) {
        case PCRStatus.Draft:
        case PCRStatus.QueriedByMonitoringOfficer:
          if (project.monitoringLevel === ProjectMonitoringLevel.InternalAssurance) {
            pcr.status = PCRStatus.SubmittedToInnovateUK;
          } else {
            pcr.status = PCRStatus.SubmittedToMonitoringOfficer;
          }
          break;
        case PCRStatus.QueriedByInnovateUK:
          pcr.status = PCRStatus.SubmittedToInnovateUK;
          break;
      }
    }

    return pcr;
  }

  protected async run(
    context: IContext,
    params: ProjectChangeRequestPrepareParams,
    button: IFormButton,
    dto: PCRDto,
  ): Promise<ILinkInfo> {
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
