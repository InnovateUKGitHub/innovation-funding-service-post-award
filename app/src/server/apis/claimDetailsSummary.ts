import {ControllerBase, ISession} from "./controllerBase";
import {ClaimDetailsSummaryDto} from "../../ui/models/claimDetailsSummaryDto";
import contextProvider from "../features/common/contextProvider";
import {GetClaimDetailsSummaryForPartnerQuery} from "../features/claims/claimDetails/getClaimDetailsSummaryForPartnerQuery";

export interface IClaimDetailsSummaryApi {
  getAllByPartnerIdForPeriod: (params: {partnerId: string, periodId: number} & ISession) => Promise<ClaimDetailsSummaryDto[]>;
}

class Controller extends ControllerBase<ClaimDetailsSummaryDto> implements IClaimDetailsSummaryApi {
  constructor() {
    super("claim-details-summary");

    this.getItems("/:partnerId/:periodId", (p, q) => ({
      partnerId: p.partnerId,
      periodId: parseInt(p.periodId, 10)
    }),  (p) => this.getAllByPartnerIdForPeriod(p));
  }

  public async getAllByPartnerIdForPeriod(params: {partnerId: string, periodId: number} & ISession) {
    const query = new GetClaimDetailsSummaryForPartnerQuery(params.partnerId, params.periodId);
    return await contextProvider.start(params.user).runQuery(query);
  }
}

export const controller = new Controller();
