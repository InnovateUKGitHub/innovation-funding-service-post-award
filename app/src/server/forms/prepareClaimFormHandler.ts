import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { ClaimDtoValidator } from "../../ui/validators/claimDtoValidator";
import { UpdateClaimCommand } from "../features/claims/updateClaim";
import { IFormButton, StandardFormHandlerBase } from "./formHandlerBase";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { ProjectRole } from "@framework/constants/project";
import { ClaimDto } from "@framework/dtos/claimDto";
import { GetClaim } from "@server/features/claims/getClaim";
import { GetAllProjectRolesForUser } from "@server/features/projects/getAllProjectRolesForUser";
import { AllClaimsDashboardRoute } from "@ui/containers/claims/allClaimsDashboard/allClaimsDashboard.page";
import { ClaimDocumentsRoute } from "@ui/containers/claims/claimDocuments.page";
import { ClaimsDashboardRoute } from "@ui/containers/claims/dashboard.page";
import { PrepareClaimParams, PrepareClaimRoute } from "@ui/containers/claims/claimPrepare.page";

export class PrepareClaimFormHandler extends StandardFormHandlerBase<PrepareClaimParams, "claim"> {
  constructor() {
    super(PrepareClaimRoute, ["default", "save"], "claim");
  }

  protected getDto(context: IContext, params: PrepareClaimParams): Promise<ClaimDto> {
    return context.runQuery(new GetClaim(params.partnerId, params.periodId));
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
