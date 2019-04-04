import { FormHandlerBase, IFormBody, IFormButton } from "./formHandlerBase";
import { AllClaimsDashboardRoute, ClaimForecastRoute, ClaimsDashboardRoute, PrepareClaimParams, PrepareClaimRoute } from "../../ui/containers";
import { Results } from "../../ui/validation/results";
import { ClaimDto, ClaimStatus, ProjectRole } from "../../types";
import { GetClaim } from "../features/claims";
import { UpdateClaimCommand } from "../features/claims/updateClaim";
import { ClaimDtoValidator } from "../../ui/validators/claimDtoValidator";
import { getClaimEditor } from "../../ui/redux/selectors";
import { ILinkInfo } from "../../types/ILinkInfo";
import { IContext } from "../../types/IContext";
import { GetAllProjectRolesForUser } from "../features/projects";

export class PrepareClaimFormHandler extends FormHandlerBase<PrepareClaimParams, ClaimDto> {
  constructor() {
    super(PrepareClaimRoute, ["default", "return"]);
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
    const roles = await context.runQuery(new GetAllProjectRolesForUser()).then(x => x.for(params.projectId, params.partnerId));
    if (roles.hasRole(ProjectRole.ProjectManager)) {
      return AllClaimsDashboardRoute.getLink(params);
    }

    return ClaimsDashboardRoute.getLink(params);
  }

  protected getStoreInfo(params: PrepareClaimParams): { key: string; store: string; } {
    return getClaimEditor(params.partnerId, params.periodId);
  }

  protected createValidationResult(params: PrepareClaimParams, dto: ClaimDto): Results<ClaimDto> {
    return new ClaimDtoValidator(dto, [], [], false);
  }
}
