import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import {
  loanDrawdownExtensionSchema,
  LoanDrawdownExtensionSchemaType,
  errorMap,
} from "@ui/pages/pcrs/loanDrawdownExtension/loanDrawdownExtension.zod";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export class PcrItemLoanDurationChangeHandler extends ZodFormHandlerBase<
  LoanDrawdownExtensionSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrLoanDurationChange],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: loanDrawdownExtensionSchema,
      errorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<LoanDrawdownExtensionSchemaType>> {
    return {
      markedAsComplete: input.markedAsComplete === "on",
      form: input.form,
      availabilityPeriodChange: input.availabilityPeriodChange,
      extensionPeriodChange: input.extensionPeriodChange,
      repaymentPeriodChange: input.repaymentPeriodChange,
      availabilityPeriod: Number(input.availabilityPeriod) ?? 0,
      extensionPeriod: Number(input.extensionPeriod) ?? 0,
      repaymentPeriod: Number(input.repaymentPeriod) ?? 0,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<LoanDrawdownExtensionSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Loan_ExtensionPeriodChange__c: Number(input.extensionPeriodChange) - input.extensionPeriod,
      Loan_RepaymentPeriodChange__c: Number(input.repaymentPeriodChange) - input.repaymentPeriod,
      Acc_AdditionalNumberofMonths__c: Number(input.availabilityPeriodChange) - input.availabilityPeriod,
    });

    return PCRPrepareItemRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      step: undefined,
    }).path;
  }
}
