import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { PartnerDtoValidator } from "@ui/validation/validators/partnerValidator";
import { IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDashboardRoute } from "@ui/containers/pages/projects/dashboard/Dashboard.page";
import { ProjectSetupParams, ProjectSetupRoute } from "@ui/containers/pages/projects/setup/projectSetup.page";
import { GetByIdQuery as GetPartnerByIdQuery } from "@server/features/partners/getByIdQuery";
import { ProjectDto } from "@framework/dtos/projectDto";
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";

export class ProjectSetupFormHandler extends StandardFormHandlerBase<ProjectSetupParams, "partner"> {
  constructor() {
    super(ProjectSetupRoute, ["default"], "partner");
  }
  protected async getDto(
    context: IContext,
    params: ProjectSetupParams,
  ): Promise<{ partner: PartnerDto; project: ProjectDto }> {
    const [partner, project] = await Promise.all([
      context.runQuery(new GetPartnerByIdQuery(params.partnerId)),
      context.runQuery(new GetByIdQuery(params.projectId)),
    ]);

    return { project, partner };
  }

  protected async run(
    context: IContext,
    params: ProjectSetupParams,
    button: IFormButton,
    { partner, project }: { partner: PartnerDto; project: ProjectDto },
  ): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePartnerCommand(partner, { projectSource: project.projectSource }));
    return ProjectDashboardRoute.getLink({});
  }

  protected getStoreKey(params: ProjectSetupParams) {
    return storeKeys.getPartnerKey(params.partnerId);
  }

  protected createValidationResult(
    params: ProjectSetupParams,
    { partner, project }: { partner: PartnerDto; project: ProjectDto },
  ) {
    return new PartnerDtoValidator(partner, partner, [], {
      showValidationErrors: false,
      projectSource: project.projectSource,
    });
  }
}
