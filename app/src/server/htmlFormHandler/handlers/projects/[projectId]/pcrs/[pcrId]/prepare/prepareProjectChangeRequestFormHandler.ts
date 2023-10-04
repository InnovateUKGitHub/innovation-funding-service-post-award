import { PCRStatus } from "@framework/constants/pcrConstants";
import { ProjectMonitoringLevel } from "@framework/constants/project";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import {
  ProjectChangeRequestPrepareParams,
  ProjectChangeRequestPrepareRoute,
} from "@ui/containers/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { ProjectChangeRequestSubmittedForReviewRoute } from "@ui/containers/pages/pcrs/submitSuccess/ProjectChangeRequestSubmittedForReview.page";
import { PCRsDashboardRoute } from "@ui/containers/pages/pcrs/dashboard/PCRDashboard.page";

export class ProjectChangeRequestPrepareFormHandler extends StandardFormHandlerBase<
  ProjectChangeRequestPrepareParams,
  "pcr"
> {
  constructor() {
    super(ProjectChangeRequestPrepareRoute, ["submit"], "pcr");
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

    if (button.value === "submit") {
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
    { projectId, pcrId }: ProjectChangeRequestPrepareParams,
    button: IFormButton,
    dto: PCRDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePCRCommand({ projectId, projectChangeRequestId: pcrId, pcr: dto }));

    if (button.value === "submit") {
      return ProjectChangeRequestSubmittedForReviewRoute.getLink({ projectId, pcrId });
    } else {
      return PCRsDashboardRoute.getLink({ projectId });
    }
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
