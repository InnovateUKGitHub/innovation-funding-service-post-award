import { FinancialVirementDto } from "@framework/dtos/financialVirementDto";
import { contextProvider } from "@server/features/common/contextProvider";
import { GetFinancialVirementQuery } from "@server/features/financialVirements/getFinancialVirementQuery";
import { UpdateFinancialVirementCommand } from "@server/features/financialVirements/updateFinancialVirementCommand";
import { processDto } from "@shared/processResponse";
import { ControllerBase, ApiParams } from "./controllerBase";

export interface IFinancialVirement<Context extends "client" | "server"> {
  get(
    params: ApiParams<Context, { projectId: ProjectId; pcrId: PcrId; pcrItemId: PcrItemId; partnerId?: PartnerId }>,
  ): Promise<FinancialVirementDto>;
  update(
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        partnerId?: PartnerId;
        financialVirement: FinancialVirementDto;
        submit: boolean;
      }
    >,
  ): Promise<FinancialVirementDto>;
}

class Controller extends ControllerBase<"server", FinancialVirementDto> {
  constructor() {
    super("financial-virements");

    this.getItem(
      "/:projectId/:pcrId/:pcrItemId",
      (p, q) => ({ projectId: p.projectId, pcrId: p.pcrId, pcrItemId: p.pcrItemId, partnerId: q.partnerId }),
      p => this.get(p),
    );
    this.putItem(
      "/:projectId/:pcrId/:pcrItemId",
      (p, q, b: FinancialVirementDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        partnerId: q.partnerId,
        financialVirement: processDto(b),
        submit: q.submit === "true",
      }),
      p => this.update(p),
    );
  }

  async get(
    params: ApiParams<"server", { projectId: ProjectId; pcrId: PcrId; pcrItemId: PcrItemId; partnerId?: PartnerId }>,
  ): Promise<FinancialVirementDto> {
    const query = new GetFinancialVirementQuery(params.projectId, params.pcrItemId, params.partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  async update(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        partnerId?: PartnerId;
        financialVirement: FinancialVirementDto;
        submit: boolean;
      }
    >,
  ): Promise<FinancialVirementDto> {
    const context = contextProvider.start(params);

    const command = new UpdateFinancialVirementCommand(
      params.projectId,
      params.pcrId,
      params.pcrItemId,
      params.financialVirement,
      params.submit,
    );
    await context.runCommand(command);

    const query = new GetFinancialVirementQuery(params.projectId, params.pcrItemId, params.partnerId);
    return await context.runQuery(query);
  }
}

export const controller = new Controller();
