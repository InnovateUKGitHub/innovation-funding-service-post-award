import contextProvider from "@server/features/common/contextProvider";
import { GetFinancialVirementQuery } from "@server/features/financialVirements/getFinancialVirementQuery";
import { UpdateFinancialVirementCommand } from "@server/features/financialVirements/updateFinancialVirementCommand";
import { processDto } from "@shared/processResponse";
import { FinancialVirementDto } from "@framework/dtos";
import { ApiParams, ControllerBase } from "./controllerBase";

class Controller extends ControllerBase<FinancialVirementDto> implements IFinancialVirement {
  constructor() {
    super("financial-virements");

    this.getItem(
      "/:projectId/:pcrId/:pcrItemId/:partnerId",
      p => ({ projectId: p.projectId, pcrId: p.pcrId, pcrItemId: p.pcrItemId, partnerId: p.partnerId }),
      p => this.get(p),
    );
    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/:partnerId",
      (p, q, b) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        partnerId: p.partnerId,
        financialVirment: processDto(b),
        submit: q.submit === "true",
      }),
      p => this.update(p),
    );
  }

  async get(
    params: ApiParams<{ projectId: string; pcrId: string; pcrItemId: string; partnerId?: string }>,
  ): Promise<FinancialVirementDto> {
    const query = new GetFinancialVirementQuery(params.projectId, params.pcrId, params.pcrItemId, params.partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  async update(
    params: ApiParams<{
      projectId: string;
      pcrId: string;
      pcrItemId: string;
      partnerId?: string;
      financialVirment: FinancialVirementDto;
      submit: boolean;
    }>,
  ): Promise<FinancialVirementDto> {
    const context = contextProvider.start(params);

    const command = new UpdateFinancialVirementCommand(
      params.projectId,
      params.pcrId,
      params.pcrItemId,
      params.financialVirment,
      params.submit,
    );
    await context.runCommand(command);

    const query = new GetFinancialVirementQuery(params.projectId, params.pcrId, params.pcrItemId, params.partnerId);
    return await context.runQuery(query);
  }
}

export type IFinancialVirement = Pick<Controller, "get" | "update">;

export const controller = new Controller();
