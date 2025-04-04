import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import {
  loanDrawdownChangeSchema,
  LoanDrawdownChangeSchema,
  errorMap,
} from "@ui/pages/pcrs/loanDrawdownChange/loanDrawdownChange.zod";
import { GetFinancialLoanVirementQuery } from "@server/features/financialVirements/getFinancialLoanVirementQuery";
import { BadRequestError } from "@shared/appError";
import { combineDayMonthYear, getDay, getMonth, getYear } from "@ui/components/atoms/Date";
import { parseCurrency } from "@framework/util/numberHelper";
import { FinancialLoanVirementDto } from "@framework/dtos/financialVirementDto";
import { handlePcrItemStatus } from "@server/repositories/projectChangeRequestRepository";

export class PcrItemLoanDrawdownChangeHandler extends ZodFormHandlerBase<
  LoanDrawdownChangeSchema,
  ProjectChangeRequestPrepareItemParams
> {
  private loanDto: FinancialLoanVirementDto | undefined;

  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrLoanDrawdownChange],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: loanDrawdownChangeSchema,
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
  }): Promise<z.input<LoanDrawdownChangeSchema>> {
    this.loanDto = await context.runQuery(new GetFinancialLoanVirementQuery(params.projectId, params.itemId));

    if (!this.loanDto) {
      throw new BadRequestError("Loan details not found");
    }

    const loanData = this.loanDto.loans.map(loan => {
      if (!loan.isEditable) return loan;

      const period = loan.period - 1;
      const newValue = input[`loans.${period}.newValue`];

      const rawNewDateDay = input[`loans.${period}.newDate_day`];
      const rawNewDateMonth = input[`loans.${period}.newDate_month`];
      const rawNewDateYear = input[`loans.${period}.newDate_year`];

      const rawNewDateYMD = `${rawNewDateYear}-${rawNewDateMonth}-${rawNewDateDay}`;
      const newDate = context.clock.parseRequiredSalesforceDateTime(rawNewDateYMD);

      return {
        ...loan,
        newDate,
        newValue,
      };
    }, []);

    return {
      markedAsComplete: input.markedAsComplete === "on",
      form: input.form,
      loans: loanData.map(loan => ({
        id: loan.id,
        isEditable: loan.isEditable,
        period: loan.period,
        currentDate: loan.currentDate,
        currentValue: loan.currentValue,
        newDate: loan.newDate,
        newValue: String(loan.newValue),
        newDate_day: getDay(loan.newDate),
        newDate_month: getMonth(loan.newDate),
        newDate_year: getYear(loan.newDate),
      })),
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<LoanDrawdownChangeSchema>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    if (!this.loanDto) {
      this.loanDto = await context.runQuery(new GetFinancialLoanVirementQuery(params.projectId, params.itemId));
    }

    const virementUpdates = input.loans
      .filter(x => x.isEditable)
      .map(x => ({
        Id: x.id,
        Acc_ProjectChangeRequest__c: params.itemId,
        Loan_NewDrawdownValue__c: parseCurrency(x.newValue),
        Loan_NewDrawdownDate__c: combineDayMonthYear(x.newDate_day, x.newDate_month, x.newDate_year)?.toISOString(),
      }));

    await context.repositories.financialLoanVirements.updateVirements(virementUpdates);

    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: handlePcrItemStatus(
        FormTypes.PcrLoanDrawdownChangeSummary,
        input.markedAsComplete,
        input.form,
      ),
    });
    return PCRPrepareItemRoute.getLink({ projectId: params.projectId, pcrId: params.pcrId, itemId: params.itemId })
      .path;
  }
}
