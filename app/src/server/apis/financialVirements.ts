import { ApiParams, ControllerBase } from "./controllerBase";
import { GetFinancialVirementsQuery } from "@server/features/financialVirements/getFinancialVirementsQuery";
import contextProvider from "@server/features/common/contextProvider";

export interface IFinancialVirement {
  get: (params: ApiParams<{ projectId: string, pcrId: string, pcrItemId: string }>) => Promise<FinancialVirementDto>;
}

class Controller extends ControllerBase<FinancialVirementDto> implements IFinancialVirement {
  constructor() {
    super("financial-virements");

    this.getItem("/:projectId/:pcrId/:pcrItemId", (p) => ({ projectId: p.projectId, pcrId: p.pcrId, pcrItemId: p.pcrItemId }), p => this.get(p));
  }

  async get(params: ApiParams<{ projectId: string, pcrId: string, pcrItemId: string }>) {
    const query = new GetFinancialVirementsQuery(params.projectId, params.pcrId, params.pcrItemId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
