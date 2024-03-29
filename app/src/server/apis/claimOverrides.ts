import { ClaimOverrideRateDto } from "@framework/dtos/claimOverrideRate";
import { GetClaimOverrideRates } from "@server/features/claims/getClaimOverrideRates";
import { contextProvider } from "@server/features/common/contextProvider";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface IClaimOverridesApi<Context extends "client" | "server"> {
  getAllByPartner: (params: ApiParams<Context, { partnerId: PartnerId }>) => Promise<ClaimOverrideRateDto>;
}

class Controller extends ControllerBase<"server", ClaimOverrideRateDto> implements IClaimOverridesApi<"server"> {
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

  public async getAllByPartner(params: ApiParams<"server", { partnerId: PartnerId }>) {
    const { partnerId } = params;
    const query = new GetClaimOverrideRates(partnerId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
