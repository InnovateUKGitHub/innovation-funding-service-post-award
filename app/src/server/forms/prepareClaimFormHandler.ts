import { FormHandlerBase } from "./formHandlerBase";
import { ClaimForecastRoute, ClaimsDashboardRoute, PrepareClaimParams, PrepareClaimRoute } from "../../ui/containers";
import { IContext } from "../features/common/context";
import { Results } from "../../ui/validation/results";
import { ClaimDto, ClaimStatus } from "../../types";
import { GetClaim } from "../features/claims";
import { UpdateClaimCommand } from "../features/claims/updateClaim";
import { ClaimDtoValidator } from "../../ui/validators/claimDtoValidator";
import { getClaimEditor } from "../../ui/redux/selectors";
export class PrepareClaimFormHandler extends FormHandlerBase<PrepareClaimParams, ClaimDto> {

  constructor() {
    super(PrepareClaimRoute);
  }

  protected async getDto(context: IContext, params: PrepareClaimParams, button: string, body: { [key: string]: string; }): Promise<ClaimDto> {
    const claim = await context.runQuery(new GetClaim(params.partnerId, params.periodId));
    claim.comments = body.comments;
    claim.status = ClaimStatus.DRAFT;
    return claim;
  }

  protected async run(context: IContext, params: PrepareClaimParams, button: string, dto: ClaimDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdateClaimCommand(dto));

    if (button === "default") {
      return ClaimForecastRoute.getLink(params);
    }
    else {
      return ClaimsDashboardRoute.getLink(params);
    }
  }

  protected getStoreInfo(params: PrepareClaimParams): { key: string; store: string; } {
    return getClaimEditor(params.partnerId, params.periodId);
  }

  protected createValidationResult(params: PrepareClaimParams, dto: ClaimDto): Results<ClaimDto> {
    return new ClaimDtoValidator(dto, [], [], false);
  }

}
