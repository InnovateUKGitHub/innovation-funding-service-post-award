import { ControllerBase, ApiParams } from "./controllerBase";
import { ClaimDetailsSummaryDto } from "../../ui/models/claimDetailsSummaryDto";
import contextProvider from "../features/common/contextProvider";
import { GetClaimDetailsSummaryForPartnerQuery } from "../features/claims/claimDetails/getClaimDetailsSummaryForPartnerQuery";

export interface IClaimDetailsSummaryApi {
  getAllByPartnerIdForPeriod: (params: ApiParams<{ partnerId: string, periodId: number }>) => Promise<ClaimDetailsSummaryDto[]>;
}

class Controller extends ControllerBase<ClaimDetailsSummaryDto> implements IClaimDetailsSummaryApi {
  constructor() {
    super("claim-details-summary");

    this.getItems("/:partnerId/:periodId", (p, q) => ({
      partnerId: p.partnerId,
      periodId: parseInt(p.periodId, 10)
    }), (p) => this.getAllByPartnerIdForPeriod(p));
  }

  public async getAllByPartnerIdForPeriod(params: ApiParams<{ partnerId: string, periodId: number }>) {
    const query = new GetClaimDetailsSummaryForPartnerQuery(params.partnerId, params.periodId);
    return await contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
