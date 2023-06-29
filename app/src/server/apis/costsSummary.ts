import { CostsSummaryForPeriodDto } from "@framework/dtos/costsSummaryForPeriodDto";
import { GetCostsSummaryForPeriodQuery } from "@server/features/claimDetails/getCostsSummaryForPeriodQuery";
import { contextProvider } from "../features/common/contextProvider";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface ICostsSummaryApi<Context extends "client" | "server"> {
  getAllByPartnerIdForPeriod: (
    params: ApiParams<Context, { projectId: ProjectId; partnerId: PartnerId; periodId: number }>,
  ) => Promise<CostsSummaryForPeriodDto[]>;
}

class Controller extends ControllerBase<"server", CostsSummaryForPeriodDto> implements ICostsSummaryApi<"server"> {
  constructor() {
    super("costs-summary");

    this.getItems(
      "/",
      (p, q) => ({
        projectId: q.projectId,
        partnerId: q.partnerId,
        periodId: parseInt(q.periodId, 10),
      }),
      p => this.getAllByPartnerIdForPeriod(p),
    );
  }

  public async getAllByPartnerIdForPeriod(
    params: ApiParams<"server", { projectId: ProjectId; partnerId: PartnerId; periodId: number }>,
  ) {
    const query = new GetCostsSummaryForPeriodQuery(params.projectId, params.partnerId, params.periodId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
