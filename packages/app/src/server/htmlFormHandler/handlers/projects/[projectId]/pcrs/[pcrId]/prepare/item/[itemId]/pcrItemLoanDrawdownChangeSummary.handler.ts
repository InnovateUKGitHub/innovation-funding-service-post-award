import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import {
  errorMap,
  LoanDrawdownChangeSummarySchema,
  loanDrawdownChangeSummarySchema,
} from "@ui/pages/pcrs/loanDrawdownChange/loanDrawdownChange.zod";
import { GetFinancialLoanVirementQuery } from "@server/features/financialVirements/getFinancialLoanVirementQuery";
import { BadRequestError } from "@shared/appError";
import { FinancialLoanVirementDto } from "@framework/dtos/financialVirementDto";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { handlePcrItemStatus } from "@server/repositories/projectChangeRequestRepository";

export class PcrItemLoanDrawdownChangeSummaryHandler extends ZodFormHandlerBase<
  LoanDrawdownChangeSummarySchema,
  ProjectChangeRequestPrepareItemParams
> {
  private loanDto: FinancialLoanVirementDto | undefined;

  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrLoanDrawdownChangeSummary],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: loanDrawdownChangeSummarySchema,
      errorMap,
    };
  }

  protected async mapToZod({
    input,
    context,
    params,
  }: {
    input: AnyObject;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<z.input<LoanDrawdownChangeSummarySchema>> {
    this.loanDto = await context.runQuery(new GetFinancialLoanVirementQuery(params.projectId, params.itemId));

    if (!this.loanDto) {
      throw new BadRequestError("Loan details not found");
    }

    return {
      markedAsComplete: input.markedAsComplete === "on",
      form: input.form,
      loans: this.loanDto.loans.map(loan => ({
        isEditable: loan.isEditable,
        id: loan.id,
        period: loan.period,
        currentDate: loan.currentDate,
        currentValue: loan.currentValue,
        newDate: loan.newDate,
        newValue: loan.newValue,
      })),
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<LoanDrawdownChangeSummarySchema>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    if (!this.loanDto) {
      this.loanDto = await context.runQuery(new GetFinancialLoanVirementQuery(params.projectId, params.itemId));
    }

    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: handlePcrItemStatus(
        FormTypes.PcrLoanDrawdownChangeSummary,
        input.markedAsComplete,
        input.form,
      ),
    });

    return ProjectChangeRequestPrepareRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
    }).path;
  }
}
