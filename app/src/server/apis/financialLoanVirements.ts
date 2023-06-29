import { FinancialLoanVirementDto } from "@framework/dtos/financialVirementDto";
import { contextProvider } from "@server/features/common/contextProvider";
import { GetFinancialLoanVirementQuery } from "@server/features/financialVirements/getFinancialLoanVirementQuery";
import { UpdateFinancialLoanVirementCommand } from "@server/features/financialVirements/updateFinancialLoanVirementCommand";
import { processDto } from "@shared/processResponse";
import { ControllerBase, ApiParams } from "./controllerBase";

export interface IFinancialLoanVirement<Context extends "client" | "server"> {
  get: (
    params: ApiParams<Context, { projectId: ProjectId; pcrItemId: PcrItemId }>,
  ) => Promise<FinancialLoanVirementDto>;
  update: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrItemId: PcrItemId;
        financialVirement: FinancialLoanVirementDto;
        submit: boolean;
      }
    >,
  ) => Promise<FinancialLoanVirementDto>;
}

class Controller
  extends ControllerBase<"server", FinancialLoanVirementDto>
  implements IFinancialLoanVirement<"server">
{
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
      (p, q, b: FinancialLoanVirementDto) => ({
        projectId: p.projectId,
        pcrItemId: p.pcrItemId,
        financialVirement: processDto(b),
        submit: q.submit === "true",
      }),
      this.update,
    );
  }

  async get(
    params: ApiParams<"server", { projectId: ProjectId; pcrItemId: PcrItemId }>,
  ): Promise<FinancialLoanVirementDto> {
    const virementQuery = new GetFinancialLoanVirementQuery(params.projectId, params.pcrItemId);

    return contextProvider.start(params).runQuery(virementQuery);
  }

  async update(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrItemId: PcrItemId;
        financialVirement: FinancialLoanVirementDto;
        submit: boolean;
      }
    >,
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

export const controller = new Controller();
