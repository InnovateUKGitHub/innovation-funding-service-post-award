import { FormHandlerBase, IFormBody, IFormButton } from "./formHandlerBase";
import { ClaimDto, ClaimStatus } from "../../types";
import { Params as ClaimForcastFormParams } from "../../ui/containers/claims/forecasts/common";
import { IContext } from "../features/common/context";
import { Results } from "../../ui/validation/results";
import { GetClaim } from "../features/claims";
import { UpdateClaimCommand } from "../features/claims/updateClaim";
import { ClaimForecastRoute, ClaimsDashboardRoute } from "../../ui/containers";
import { getClaimEditor } from "../../ui/redux/selectors";
import { ClaimDtoValidator } from "../../ui/validators";

export class ClaimForcastFormHandler extends FormHandlerBase<ClaimForcastFormParams, ClaimDto> {

  constructor() {
    super(ClaimForecastRoute, ["save", "default"]);
  }

  protected async getDto(context: IContext, params: ClaimForcastFormParams, button: IFormButton, body: IFormBody): Promise<ClaimDto> {
    // ToDo: Get the period id back.....!!!!
    const query = new GetClaim(params.partnerId, (params as any).periodId);
    const claim = await context.runQuery(query);
    claim.status = ClaimStatus.SUBMITTED;
    return claim;
  }

  protected async run(context: IContext, params: ClaimForcastFormParams, button: IFormButton, dto: ClaimDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdateClaimCommand(dto));
    return ClaimsDashboardRoute.getLink(params);
  }

  protected getStoreInfo(params: ClaimForcastFormParams): { key: string; store: string; } {
    // ToDo: Get the period id back.....!!!!
    return getClaimEditor(params.partnerId, (params as any).periodId);
  }

  protected createValidationResult(params: ClaimForcastFormParams, dto: ClaimDto): Results<ClaimDto> {
    return new ClaimDtoValidator(dto, [], [], false);
  }
}
