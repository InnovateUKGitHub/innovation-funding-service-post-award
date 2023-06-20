import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { IFormButton, StandardFormHandlerBase } from "./formHandlerBase";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDashboardRoute } from "@ui/containers/projects/dashboard/Dashboard.page";
import { ProjectSetupParams, ProjectSetupRoute } from "@ui/containers/projects/setup/projectSetup.page";
import { GetByIdQuery as GetPartnerByIdQuery } from "@server/features/partners/getByIdQuery";

export class ProjectSetupFormHandler extends StandardFormHandlerBase<ProjectSetupParams, "partner"> {
  constructor() {
    super(ProjectSetupRoute, ["default"], "partner");
  }
  protected async getDto(context: IContext, params: ProjectSetupParams): Promise<PartnerDto> {
    return context.runQuery(new GetPartnerByIdQuery(params.partnerId));
  }

  protected async run(
    context: IContext,
    params: ProjectSetupParams,
    button: IFormButton,
    dto: PartnerDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePartnerCommand(dto));
    return ProjectDashboardRoute.getLink({});
  }

  protected getStoreKey(params: ProjectSetupParams) {
    return storeKeys.getPartnerKey(params.partnerId);
  }

  protected createValidationResult(params: ProjectSetupParams, dto: PartnerDto) {
    return new PartnerDtoValidator(dto, dto, [], { showValidationErrors: false });
  }
}
