import { UpdateClaimCommand } from "../features/claims/updateClaim";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "./formHandlerBase";
import { ClaimDto, ClaimStatus, ProjectRole } from "@framework/types";
import { GetClaim } from "../features/claims";
import { AllClaimsDashboardRoute, ClaimForecastRoute, ClaimsDashboardRoute, PrepareClaimParams, PrepareClaimRoute } from "../../ui/containers";
import { ClaimDtoValidator } from "../../ui/validators/claimDtoValidator";
import { getClaimEditor } from "../../ui/redux/selectors";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { GetAllProjectRolesForUser } from "../features/projects";

export class PrepareClaimFormHandler extends StandardFormHandlerBase<PrepareClaimParams, "claim"> {
  constructor() {
    super(PrepareClaimRoute, ["default", "return"], "claim");
  }

  protected async getDto(context: IContext, params: PrepareClaimParams, button: IFormButton, body: IFormBody): Promise<ClaimDto> {
    const claim = await context.runQuery(new GetClaim(params.partnerId, params.periodId));
    claim.comments = body.comments;
    claim.status = ClaimStatus.DRAFT;
    return claim;
  }

  protected async run(context: IContext, params: PrepareClaimParams, button: IFormButton, dto: ClaimDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdateClaimCommand(params.projectId, dto));

    if (button.name === "default") {
      return ClaimForecastRoute.getLink(params);
    }

    // if pm as well as fc then go to all claims route
    const roles = await context.runQuery(new GetAllProjectRolesForUser()).then(x => x.forProject(params.projectId));
    if (roles.hasRole(ProjectRole.ProjectManager)) {
      return AllClaimsDashboardRoute.getLink(params);
    }

    return ClaimsDashboardRoute.getLink(params);
  }

  protected getStoreKey(params: PrepareClaimParams) {
    return getClaimEditor(params.partnerId, params.periodId).key;
  }

  protected createValidationResult(params: PrepareClaimParams, dto: ClaimDto) {
    return new ClaimDtoValidator(dto, ClaimStatus.UNKNOWN, [], [], false);
  }
}
