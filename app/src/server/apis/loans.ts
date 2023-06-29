import { contextProvider } from "@server/features/common/contextProvider";

import { LoanDto } from "@framework/dtos/loanDto";

import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { GetAllLoans } from "@server/features/loans/getAllLoans";
import { GetLoan } from "@server/features/loans/getLoan";
import { UpdateLoanCommand } from "@server/features/loans/updateLoanCommand";
import { processDto } from "@shared/processResponse";

export interface ILoansApi<Context extends "client" | "server"> {
  getAll(params: ApiParams<Context, { projectId: ProjectId }>): Promise<LoanDto[]>;
  get(params: ApiParams<Context, { projectId: ProjectId; loanId?: string; periodId?: number }>): Promise<LoanDto>;
  update(params: ApiParams<Context, { projectId: ProjectId; loanId: string; loan: LoanDto }>): Promise<LoanDto>;
}

class LoansApi extends ControllerBase<"server", LoanDto> {
  constructor() {
    super("loans");

    this.getItems(
      "/:projectId",
      p => ({
        projectId: p.projectId,
      }),
      this.getAll,
    );

    this.getItem(
      "/get/:projectId",
      (p, q) => ({
        projectId: p.projectId,
        loanId: q.loanId,
        periodId: q.periodId ? Number(q.periodId) : undefined,
      }),
      this.get,
    );

    super.putItem(
      "/:projectId/:loanId",
      (p, q, b: LoanDto) => ({
        projectId: p.projectId,
        loanId: p.loanId,
        loan: processDto(b),
      }),
      this.update,
    );
  }

  public async getAll(params: ApiParams<"server", { projectId: ProjectId }>): Promise<LoanDto[]> {
    const query = new GetAllLoans(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async get(
    params: ApiParams<"server", { projectId: ProjectId; loanId?: string; periodId?: number }>,
  ): Promise<LoanDto> {
    const loanQuery = new GetLoan(params.projectId, params);

    return contextProvider.start(params).runQuery(loanQuery);
  }

  public async update(
    params: ApiParams<"server", { projectId: ProjectId; loanId: string; loan: LoanDto }>,
  ): Promise<LoanDto> {
    const context = contextProvider.start(params);

    const loanCommand = new UpdateLoanCommand(params.projectId, params.loanId, params.loan);
    await context.runCommand(loanCommand);

    const updatedLoan = new GetLoan(params.projectId, params);

    return context.runQuery(updatedLoan);
  }
}

export const controller = new LoansApi();
