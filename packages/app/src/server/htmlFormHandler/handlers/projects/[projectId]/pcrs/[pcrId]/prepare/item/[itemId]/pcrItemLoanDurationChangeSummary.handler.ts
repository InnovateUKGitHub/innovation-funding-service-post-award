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
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";

export class PcrItemLoanDurationChangeSummaryHandler extends ZodFormHandlerBase<
  LoanDrawdownExtensionSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrLoanDurationChangeSummary],
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
      availabilityPeriodChange: input.availabilityPeriodChange,
      extensionPeriodChange: input.extensionPeriodChange,
      repaymentPeriodChange: input.repaymentPeriodChange,
      availabilityPeriod: Number(input.availabilityPeriod) ?? 0,
      extensionPeriod: Number(input.extensionPeriod) ?? 0,
      repaymentPeriod: Number(input.repaymentPeriod) ?? 0,
      form: input.form,
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
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(
        input.markedAsComplete ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
      ),
    });

    return ProjectChangeRequestPrepareRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
    }).path;
  }
}
