import { contextProvider } from "@server/features/common/contextProvider";
import { LoanUpdateDto } from "@framework/dtos/loanDto";
import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { UpdateLoanCommand } from "@server/features/loans/updateLoanCommand";
import { processDto } from "@shared/processResponse";

export interface ILoansApi<Context extends "client" | "server"> {
  update(params: ApiParams<Context, { projectId: ProjectId; loanId: LoanId; loan: LoanUpdateDto }>): Promise<boolean>;
}

class LoansApi extends ControllerBase<"server", boolean> {
  constructor() {
    super("loans");
    super.putItem(
      "/:projectId/:loanId",
      (p, q, b: LoanUpdateDto) => ({
        projectId: p.projectId,
        loanId: p.loanId,
        loan: processDto(b),
      }),
      this.update,
    );
  }

  public async update(
    params: ApiParams<"server", { projectId: ProjectId; loanId: LoanId; loan: LoanUpdateDto }>,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    const loanCommand = new UpdateLoanCommand(params.projectId, params.loanId, params.loan);
    await context.runCommand(loanCommand);

    return true;
  }
}

export const controller = new LoansApi();
