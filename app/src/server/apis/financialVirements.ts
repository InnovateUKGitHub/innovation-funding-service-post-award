import contextProvider from "@server/features/common/contextProvider";
import { ApiParams, ControllerBase } from "./controllerBase";
import { GetFinancialVirementQuery } from "@server/features/financialVirements/getFinancialVirementQuery";
import { UpdateFinancialVirementCommand } from "@server/features/financialVirements/updateFinancialVirementCommand";
import { processDto } from "@shared/processResponse";

export interface IFinancialVirement {
  get: (params: ApiParams<{ projectId: string, pcrId: string, pcrItemId: string }>) => Promise<FinancialVirementDto>;
  update: (params: ApiParams<{ projectId: string, pcrId: string, pcrItemId: string, financialVirment: FinancialVirementDto, submit: boolean }>) => Promise<FinancialVirementDto>;
}

class Controller extends ControllerBase<FinancialVirementDto> implements IFinancialVirement {
  constructor() {
    super("financial-virements");

    this.getItem("/:projectId/:pcrId/:pcrItemId", (p) => ({ projectId: p.projectId, pcrId: p.pcrId, pcrItemId: p.pcrItemId }), p => this.get(p));
    this.putItem("/:projectId/:pcrId/:pcrItemId", (p, q, b) => ({ projectId: p.projectId, pcrId: p.pcrId, pcrItemId: p.pcrItemId, financialVirment: processDto(b), submit: q.submit === "true" }), p => this.update(p));
  }

  async get(params: ApiParams<{ projectId: string, pcrId: string, pcrItemId: string }>) {
    const query = new GetFinancialVirementQuery(params.projectId, params.pcrId, params.pcrItemId);
    return contextProvider.start(params).runQuery(query);
  }

  async update(params: ApiParams<{ projectId: string; pcrId: string; pcrItemId: string; financialVirment: FinancialVirementDto, submit: boolean }>): Promise<FinancialVirementDto> {
    const context = contextProvider.start(params);

    const command = new UpdateFinancialVirementCommand(params.projectId, params.pcrId, params.pcrItemId, params.financialVirment, params.submit);
    await context.runCommand(command);

    const query = new GetFinancialVirementQuery(params.projectId, params.pcrId, params.pcrItemId);
    return await context.runQuery(query);
  }
}

export const controller = new Controller();
