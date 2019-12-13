import { ApiParams, ControllerBase } from "./controllerBase";
import { GetFinancialVirementQuery, GetFinancialVirementV2Query } from "@server/features/financialVirements/getFinancialVirementQuery";
import contextProvider from "@server/features/common/contextProvider";
import { processDto } from "@shared/processResponse";
import { UpdateFinancialVirementCommand, UpdateFinancialVirementV2Command } from "@server/features/financialVirements/updateFinancialVirementCommand";

export interface IFinancialVirement {
  get: (params: ApiParams<{ projectId: string, pcrId: string, pcrItemId: string }>) => Promise<FinancialVirementDto>;
  update: (params: ApiParams<{ projectId: string, pcrId: string, pcrItemId: string, financialVirment: FinancialVirementDto }>) => Promise<FinancialVirementDto>;
  getV2: (params: ApiParams<{ projectId: string, pcrId: string, pcrItemId: string }>) => Promise<FinancialVirementV2Dto>;
  updateV2: (params: ApiParams<{ projectId: string, pcrId: string, pcrItemId: string, financialVirment: FinancialVirementV2Dto }>) => Promise<FinancialVirementV2Dto>;
}

class Controller extends ControllerBase<FinancialVirementDto> implements IFinancialVirement {
  constructor() {
    super("financial-virements");

    this.getItem("/:projectId/:pcrId/:pcrItemId", (p) => ({ projectId: p.projectId, pcrId: p.pcrId, pcrItemId: p.pcrItemId }), p => this.get(p));
    this.putItem("/:projectId/:pcrId/:pcrItemId", (p, q, b) => ({ projectId: p.projectId, pcrId: p.pcrId, pcrItemId: p.pcrItemId, financialVirment: processDto(b) }), p => this.update(p));

    this.getCustom("/v2/:projectId/:pcrId/:pcrItemId", (p) => ({ projectId: p.projectId, pcrId: p.pcrId, pcrItemId: p.pcrItemId }), p => this.getV2(p));
    this.putCustom("/v2/:projectId/:pcrId/:pcrItemId", (p, q, b) => ({ projectId: p.projectId, pcrId: p.pcrId, pcrItemId: p.pcrItemId, financialVirment: processDto(b) }), p => this.updateV2(p));
  }

  async get(params: ApiParams<{ projectId: string, pcrId: string, pcrItemId: string }>) {
    const query = new GetFinancialVirementQuery(params.projectId, params.pcrId, params.pcrItemId);
    return contextProvider.start(params).runQuery(query);
  }

  async getV2(params: ApiParams<{ projectId: string, pcrId: string, pcrItemId: string }>) {
    const query = new GetFinancialVirementV2Query(params.projectId, params.pcrId, params.pcrItemId);
    return contextProvider.start(params).runQuery(query);
  }

  async update(params: ApiParams<{ projectId: string; pcrId: string; pcrItemId: string; financialVirment: FinancialVirementDto }>): Promise<FinancialVirementDto> {
    const context = contextProvider.start(params);

    const command = new UpdateFinancialVirementCommand(params.projectId, params.pcrId, params.pcrItemId, params.financialVirment);
    await context.runCommand(command);

    const query = new GetFinancialVirementQuery(params.projectId, params.pcrId, params.pcrItemId);
    return await context.runQuery(query);
  }

  async updateV2(params: ApiParams<{ projectId: string; pcrId: string; pcrItemId: string; financialVirment: FinancialVirementV2Dto }>): Promise<FinancialVirementV2Dto> {
    const context = contextProvider.start(params);

    const command = new UpdateFinancialVirementV2Command(params.projectId, params.pcrId, params.pcrItemId, params.financialVirment);
    await context.runCommand(command);

    const query = new GetFinancialVirementV2Query(params.projectId, params.pcrId, params.pcrItemId);
    return await context.runQuery(query);
  }
}

export const controller = new Controller();
