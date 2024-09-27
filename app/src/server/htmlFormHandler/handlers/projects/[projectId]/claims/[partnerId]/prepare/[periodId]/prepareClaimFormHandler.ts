import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { storeKeys } from "@server/features/common/storeKeys";
import { ClaimDtoValidator } from "@ui/validation/validators/claimDtoValidator";
import { UpdateClaimCommand } from "@server/features/claims/updateClaim";
import { IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { ProjectRole } from "@framework/constants/project";
import { ClaimDto } from "@framework/dtos/claimDto";
import { GetClaimByPartnerIdAndPeriod } from "@server/features/claims/GetClaimByPartnerIdAndPeriod";
import { GetAllProjectRolesForUser } from "@server/features/projects/getAllProjectRolesForUser";
import { AllClaimsDashboardRoute } from "@ui/pages/claims/allClaimsDashboard/allClaimsDashboard.page";
import { ClaimsDashboardRoute } from "@ui/pages/claims/claimDashboard.page";
import { PrepareClaimParams, PrepareClaimRoute } from "@ui/pages/claims/claimPrepare.page";
import { ClaimDocumentsRoute } from "@ui/pages/claims/documents/ClaimDocuments.page";

export class PrepareClaimFormHandler extends StandardFormHandlerBase<PrepareClaimParams, ClaimDto> {
  constructor() {
    super(PrepareClaimRoute, ["default", "save"]);
  }

  protected getDto(context: IContext, params: PrepareClaimParams): Promise<ClaimDto> {
    return context.runQuery(new GetClaimByPartnerIdAndPeriod(params.partnerId, params.periodId));
  }

  protected async run(
    context: IContext,
    params: PrepareClaimParams,
    button: IFormButton,
    dto: ClaimDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(new UpdateClaimCommand(params.projectId, dto));

    if (button.name === "default") {
      return ClaimDocumentsRoute.getLink(params);
    }
    // if pm as well as fc then go to all claims route
    const roles = await context.runQuery(new GetAllProjectRolesForUser()).then(x => x.forProject(params.projectId));
    if (roles.hasRole(ProjectRole.ProjectManager)) {
      return AllClaimsDashboardRoute.getLink(params);
    }

    return ClaimsDashboardRoute.getLink(params);
  }

  protected getStoreKey(params: PrepareClaimParams) {
    return storeKeys.getClaimKey(params.partnerId, params.periodId);
  }

  protected createValidationResult(params: PrepareClaimParams, dto: ClaimDto) {
    return new ClaimDtoValidator(dto, ClaimStatus.UNKNOWN, [], [], false, "");
  }
}
