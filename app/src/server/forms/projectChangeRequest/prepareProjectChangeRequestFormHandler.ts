import { PCRStatus, ProjectMonitoringLevel } from "@framework/constants";
import { PCRDto } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { GetByIdQuery } from "@server/features/projects";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  PCRsDashboardRoute,
  ProjectChangeRequestPrepareParams,
  ProjectChangeRequestPrepareRoute,
} from "@ui/containers";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PCRDtoValidator } from "@ui/validators";

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
    await context.runCommand(
      new UpdatePCRCommand({ projectId: params.projectId, projectChangeRequestId: params.pcrId, pcr: dto }),
    );
    return PCRsDashboardRoute.getLink({ projectId: params.projectId });
  }

  protected getStoreKey(params: ProjectChangeRequestPrepareParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareParams, dto: PCRDto) {
    return new PCRDtoValidator({
      model: dto,
      original: dto,
    });
  }
}
