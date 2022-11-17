import { ClaimOverrideRateDto } from "@framework/dtos/claimOverrideRate";
import { GetClaimOverrideRates } from "@server/features/claims/getClaimOverrideRates";
import { contextProvider } from "@server/features/common/contextProvider";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface IClaimOverridesApi {
  getAllByPartner: (params: ApiParams<{ partnerId: string }>) => Promise<ClaimOverrideRateDto>;
}

class Controller extends ControllerBase<ClaimOverrideRateDto> implements IClaimOverridesApi {
  constructor() {
    super("claim-overrides");

    this.getItem(
      "/:partnerId",
      p => ({
        partnerId: p.partnerId,
      }),
      p => this.getAllByPartner(p),
    );
  }

  public async getAllByPartner(params: ApiParams<{ partnerId: string }>) {
    const { partnerId } = params;
    const query = new GetClaimOverrideRates(partnerId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
