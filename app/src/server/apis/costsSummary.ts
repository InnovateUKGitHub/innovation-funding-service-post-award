import { ApiParams, ControllerBase } from "./controllerBase";
import { GetCostsSummaryForPeriodQuery } from "../features/claimDetails";
import contextProvider from "../features/common/contextProvider";
import { CostsSummaryForPeriodDto } from "@framework/dtos";

export interface ICostsSummaryApi {
  getAllByPartnerIdForPeriod: (params: ApiParams<{ projectId: string, partnerId: string, periodId: number }>) => Promise<CostsSummaryForPeriodDto[]>;
}

class Controller extends ControllerBase<CostsSummaryForPeriodDto> implements ICostsSummaryApi {
  constructor() {
    super("costs-summary");

    this.getItems("/", (p, q) => ({
      projectId: q.projectId,
      partnerId: q.partnerId,
      periodId: parseInt(q.periodId, 10)
    }), (p) => this.getAllByPartnerIdForPeriod(p));
  }

  public async getAllByPartnerIdForPeriod(params: ApiParams<{ projectId: string, partnerId: string, periodId: number }>) {
    const query = new GetCostsSummaryForPeriodQuery(params.projectId, params.partnerId, params.periodId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
