import { ApiParams, ControllerBase } from "./controllerBase";
import { GetClaimDetailsSummaryForPartnerQuery } from "../features/claimDetails";
import contextProvider from "../features/common/contextProvider";

export interface IClaimDetailsSummaryApi {
  getAllByPartnerIdForPeriod: (params: ApiParams<{ projectId: string, partnerId: string, periodId: number }>) => Promise<ClaimDetailsSummaryDto[]>;
}

class Controller extends ControllerBase<ClaimDetailsSummaryDto> implements IClaimDetailsSummaryApi {
  constructor() {
    super("claim-details-summary");

    this.getItems("/:projectId/:partnerId/:periodId", (p, q) => ({
      projectId: p.projectId,
      partnerId: p.partnerId,
      periodId: parseInt(p.periodId, 10)
    }), (p) => this.getAllByPartnerIdForPeriod(p));
  }

  public async getAllByPartnerIdForPeriod(params: ApiParams<{ projectId: string, partnerId: string, periodId: number }>) {
    const query = new GetClaimDetailsSummaryForPartnerQuery(params.projectId, params.partnerId, params.periodId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
