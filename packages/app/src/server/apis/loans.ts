import { contextProvider } from "@server/features/common/contextProvider";
import { LoanDto } from "@framework/dtos/loanDto";
import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { GetLoan } from "@server/features/loans/getLoan";
import { UpdateLoanCommand } from "@server/features/loans/updateLoanCommand";
import { processDto } from "@shared/processResponse";

export interface ILoansApi<Context extends "client" | "server"> {
  update(params: ApiParams<Context, { projectId: ProjectId; loanId: string; loan: LoanDto }>): Promise<LoanDto>;
}

class LoansApi extends ControllerBase<"server", LoanDto> {
  constructor() {
    super("loans");
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

  public async update(
    params: ApiParams<"server", { projectId: ProjectId; loanId: string; loan: LoanDto }>,
  ): Promise<LoanDto> {
    const context = await contextProvider.start(params);

    const loanCommand = new UpdateLoanCommand(params.projectId, params.loanId, params.loan);
    await context.runCommand(loanCommand);

    const updatedLoan = new GetLoan(params.projectId, params);

    return context.runQuery(updatedLoan);
  }
}

export const controller = new LoansApi();
