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
import { UpdateFinancialLoanVirementCommand } from "@server/features/financialVirements/updateFinancialLoanVirementCommand";
import { FinancialLoanVirementDto } from "@framework/dtos/financialVirementDto";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

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
    const dto = {
      pcrItemId: params.itemId,
      loans: input.loans.map(x => {
        const matchingOriginalData = this.loanDto?.loans?.find(y => y.period === x.period);

        if (!matchingOriginalData) {
          throw new Error("missing original data");
        }

        return {
          ...x,
          period: x.period as PeriodId,
          id: matchingOriginalData.id,
          status: matchingOriginalData.status,
          isEditable: matchingOriginalData.isEditable,
        };
      }),
    };
    await context.runCommand(
      new UpdateFinancialLoanVirementCommand(params.projectId, params.itemId, dto, input.markedAsComplete),
    );

    await context.runCommand(
      new UpdatePCRCommand({
        projectId: params.projectId,
        projectChangeRequestId: params.pcrId,
        pcr: {
          projectId: params.projectId,
          id: params.pcrId,
          items: [
            {
              id: params.itemId,
              status: input.markedAsComplete ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
            },
          ],
        },
      }),
    );

    return ProjectChangeRequestPrepareRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
    }).path;
  }
}
