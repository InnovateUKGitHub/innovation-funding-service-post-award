import {ControllerBase} from "./controllerBase";
import {ClaimDetailsDto} from "../../ui/models/claimDetailsDto";
import contextProvider from "../features/common/contextProvider";
import {GetClaimDetailsSummaryForPartnerQuery} from "../features/claims/claimDetails/getClaimDetailsSummaryForPartnerQuery";

export interface IClaimDetailsSummaryApi {
  getAllByPartnerIdForPeriod: (partnerId: string, periodId: number) => Promise<ClaimDetailsDto[]>;
}

class Controller extends ControllerBase<ClaimDetailsDto> implements IClaimDetailsSummaryApi {
  public path = "claimdetailssummary";

  constructor() {
    super();

    this.getItems("/:partnerId/:periodId", (p, q) => ({
      partnerId: p.partnerId,
      periodId: parseInt(p.periodId, 10)
    }), (p) => this.getAllByPartnerIdForPeriod(p.partnerId, p.periodId));
  }

  public async getAllByPartnerIdForPeriod(partnerId: string, periodId: number) {
    const query = new GetClaimDetailsSummaryForPartnerQuery(partnerId, periodId);
    return await contextProvider.start().runQuery(query);
  }
}

export const controller = new Controller();
