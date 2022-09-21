import { contextProvider } from "@server/features/common/contextProvider";
import { GetFinancialLoanVirementQuery } from "@server/features/financialVirements/getFinancialLoanVirementQuery";
import { UpdateFinancialLoanVirementCommand } from "@server/features/financialVirements/updateFinancialLoanVirementCommand";
import { processDto } from "@shared/processResponse";
import { FinancialLoanVirementDto } from "@framework/dtos";
import { ApiParams, ControllerBase } from "./controllerBase";

class Controller extends ControllerBase<FinancialLoanVirementDto> {
  constructor() {
    super("financial-loan-virements");

    this.getItem(
      "/:projectId/:pcrItemId",
      p => ({
        projectId: p.projectId,
        pcrItemId: p.pcrItemId,
      }),
      this.get,
    );

    this.putItem(
      "/:projectId/:pcrItemId",
      (p, q, b) => ({
        projectId: p.projectId,
        pcrItemId: p.pcrItemId,
        financialVirement: processDto(b),
        submit: q.submit === "true",
      }),
      this.update,
    );
  }

  async get(params: ApiParams<{ projectId: string; pcrItemId: string }>): Promise<FinancialLoanVirementDto> {
    const virementQuery = new GetFinancialLoanVirementQuery(params.projectId, params.pcrItemId);

    return contextProvider.start(params).runQuery(virementQuery);
  }

  async update(
    params: ApiParams<{
      projectId: string;
      pcrItemId: string;
      financialVirement: FinancialLoanVirementDto;
      submit: boolean;
    }>,
  ): Promise<FinancialLoanVirementDto> {
    const context = contextProvider.start(params);

    const command = new UpdateFinancialLoanVirementCommand(
      params.projectId,
      params.pcrItemId,
      params.financialVirement,
      params.submit,
    );
    await context.runCommand(command);

    const query = new GetFinancialLoanVirementQuery(params.projectId, params.pcrItemId);
    return await context.runQuery(query);
  }
}

export type IFinancialLoanVirement = Pick<Controller, "get" | "update">;

export const controller = new Controller();
