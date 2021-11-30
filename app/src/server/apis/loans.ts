import contextProvider from "@server/features/common/contextProvider";

import { LoanDto, LoanDtoWithTotals } from "@framework/dtos/loanDto";

import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { GetAllLoans } from "@server/features/loans/getAllLoans";
import { GetLoan } from "@server/features/loans/getLoan";
import { UpdateLoanCommand } from "@server/features/loans/updateLoanCommand";
import { processDto } from "@shared/processResponse";

class LoansApi extends ControllerBase<LoanDto | LoanDtoWithTotals> {
  constructor() {
    super("loans");

    this.getItems("/:projectId", p => ({ projectId: p.projectId }), this.getAll);

    this.getItem(
      "/:projectId/:loanId",
      (p, q) => ({ withTotals: q.totals === "true", projectId: p.projectId, loanId: p.loanId }),
      this.get,
    );

    super.putItem(
      "/:projectId/:loanId",
      (p, q, b) => ({ projectId: p.projectId, loanId: p.loanId, loan: processDto(b) }),
      this.update,
    );
  }

  public async getAll(params: ApiParams<{ projectId: string }>): Promise<LoanDto[]> {
    const query = new GetAllLoans(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async get<T extends boolean>(
    params: ApiParams<{ withTotals: T; projectId: string; loanId: string }>,
  ): Promise<T extends true ? LoanDtoWithTotals : LoanDto> {
    const loanQuery = new GetLoan(params.withTotals, params.projectId, params.loanId);

    // TODO: Address this, loanQuery is not smart enough to return = T extends true ? LoanDtoWithTotals : LoanDto
    return contextProvider.start(params).runQuery(loanQuery as any);
  }

  public async update(
    params: ApiParams<{ projectId: string; loanId: string; loan: LoanDto }>,
  ): Promise<LoanDto> {
    const context = contextProvider.start(params);

    const loanCommand = new UpdateLoanCommand(params.projectId, params.loanId, params.loan);
    await context.runCommand(loanCommand);

    const updatedLoan = new GetLoan(false, params.projectId, params.loanId);

    return context.runQuery(updatedLoan);
  }
}

export const controller = new LoansApi();

export type ILoansApi = Pick<LoansApi, "getAll" | "get" | "update">;
