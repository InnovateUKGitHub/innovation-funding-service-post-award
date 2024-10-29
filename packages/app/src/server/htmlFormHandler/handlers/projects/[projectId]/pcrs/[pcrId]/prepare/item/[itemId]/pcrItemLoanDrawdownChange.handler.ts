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
import { UpdateFinancialLoanVirementCommand } from "@server/features/financialVirements/updateFinancialLoanVirementCommand";
import { parseCurrency } from "@framework/util/numberHelper";
import { FinancialLoanVirementDto } from "@framework/dtos/financialVirementDto";

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
      loans: loanData.map(loan => ({
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
    const dto = {
      pcrItemId: params.itemId,
      loans: input.loans.map(x => {
        const matchingOriginalData = this.loanDto?.loans?.find(y => y.period === x.period);
        const newDate = combineDayMonthYear(x.newDate_day, x.newDate_month, x.newDate_year);

        if (!matchingOriginalData) {
          throw new Error("missing original data");
        }
        if (!newDate) {
          throw Error("missing a new date");
        }
        return {
          ...x,
          period: x.period as PeriodId,
          id: matchingOriginalData.id,
          status: matchingOriginalData.status,
          isEditable: matchingOriginalData.isEditable,
          newDate,
          newValue: parseCurrency(x.newValue),
        };
      }),
    };
    await context.runCommand(
      new UpdateFinancialLoanVirementCommand(params.projectId, params.itemId, dto, input.markedAsComplete),
    );
    return PCRPrepareItemRoute.getLink({ projectId: params.projectId, pcrId: params.pcrId, itemId: params.itemId })
      .path;
  }
}
