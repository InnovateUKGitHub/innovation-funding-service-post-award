import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { ClaimDtoValidator } from "../../ui/validators/claimDtoValidator";
import { UpdateClaimCommand } from "../features/claims/updateClaim";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "./formHandlerBase";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { ProjectMonitoringLevel, ProjectRole } from "@framework/constants/project";
import { ClaimDto } from "@framework/dtos/claimDto";
import { GetClaim } from "@server/features/claims/getClaim";
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { GetAllProjectRolesForUser } from "@server/features/projects/getAllProjectRolesForUser";
import { AllClaimsDashboardRoute } from "@ui/containers/claims/allClaimsDashboard/allClaimsDashboard.page";
import { ClaimsDashboardRoute } from "@ui/containers/claims/dashboard.page";
import { PrepareClaimParams } from "@ui/containers/claims/prepare.page";
import { ClaimSummaryRoute } from "@ui/containers/claims/summary.page";

export class ClaimSummaryFormHandler extends StandardFormHandlerBase<PrepareClaimParams, "claim"> {
  constructor() {
    super(ClaimSummaryRoute, ["default", "save"], "claim");
  }

  protected async getDto(
    context: IContext,
    params: PrepareClaimParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<ClaimDto> {
    const claim = await context.runQuery(new GetClaim(params.partnerId, params.periodId));

    claim.comments = body.comments;

    // Note: Not submitted so we only care about comments being updated
    if (button.name !== "default") return claim;

    const project = await context.runQuery(new GetByIdQuery(params.projectId));

    switch (claim.status) {
      case ClaimStatus.DRAFT:
      case ClaimStatus.MO_QUERIED:
        if (project.monitoringLevel === ProjectMonitoringLevel.InternalAssurance) {
          claim.status = ClaimStatus.AWAITING_IUK_APPROVAL;
        } else {
          claim.status = ClaimStatus.SUBMITTED;
        }
        break;

      case ClaimStatus.AWAITING_IAR:
      case ClaimStatus.INNOVATE_QUERIED:
        claim.status = ClaimStatus.AWAITING_IUK_APPROVAL;
        break;
    }

    return claim;
  }

  protected async run(
    context: IContext,
    params: PrepareClaimParams,
    button: IFormButton,
    dto: ClaimDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(new UpdateClaimCommand(params.projectId, dto, true));

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
    return new ClaimDtoValidator(dto, ClaimStatus.UNKNOWN, [], [], false, "", true);
  }
}
