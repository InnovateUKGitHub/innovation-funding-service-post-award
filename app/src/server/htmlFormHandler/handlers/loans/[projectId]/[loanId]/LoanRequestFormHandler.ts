import { IContext } from "@framework/types/IContext";
import { GetLoan } from "@server/features/loans/getLoan";
import { UpdateLoanCommand } from "@server/features/loans/updateLoanCommand";
import { LoansSummaryRoute } from "@ui/containers/pages/loans/loanOverview.page";
import { LoansRequestParams, LoansRequestRoute } from "@ui/containers/pages/loans/loanRequest.page";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  LoanRequestSchemaType,
  loanRequestErrorMap,
  loanRequestSchema,
} from "@ui/containers/pages/loans/loanRequest.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export class LoanRequestFormHandler extends ZodFormHandlerBase<LoanRequestSchemaType, LoansRequestParams> {
  constructor() {
    super({
      route: LoansRequestRoute,
      forms: [FormTypes.LoanRequest],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: loanRequestSchema,
      errorMap: loanRequestErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<LoanRequestSchemaType>> {
    return {
      form: input.form,
      comments: input.comments ?? "",
    };
  }

  protected async run({
    input,
    params,
    context,
  }: {
    input: z.output<LoanRequestSchemaType>;
    params: LoansRequestParams;
    context: IContext;
  }): Promise<string> {
    const originalLoanQuery = new GetLoan(params.projectId, { loanId: params.loanId });
    const originalLoan = await context.runQuery(originalLoanQuery);

    const dto = { ...originalLoan, comments: input.comments };
    const updateLoanQuery = new UpdateLoanCommand(params.projectId, params.loanId, dto);
    await context.runCommand(updateLoanQuery);

    return LoansSummaryRoute.getLink(params).path;
  }
}
