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
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

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

  protected async getZodSchema({ input }: { input: AnyObject }) {
    const availabilityPeriod = Number(input.availabilityPeriod) ?? 0;
    const extensionPeriod = Number(input.extensionPeriod) ?? 0;
    const repaymentPeriod = Number(input.repaymentPeriod) ?? 0;
    return {
      schema: loanDrawdownExtensionSchema({ availabilityPeriod, extensionPeriod, repaymentPeriod }),
      errorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<LoanDrawdownExtensionSchemaType>> {
    return {
      markedAsComplete: input.markedAsComplete === "on",
      availabilityPeriodChange: input.availabilityPeriodChange,
      extensionPeriodChange: input.extensionPeriodChange,
      repaymentPeriodChange: input.repaymentPeriodChange,
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
    await context.runCommand(
      new UpdatePCRCommand({
        projectId: params.projectId,
        projectChangeRequestId: params.pcrId,
        pcr: {
          projectId: params.projectId,
          id: params.pcrId,
          items: [
            {
              status: input.markedAsComplete ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
              id: params.itemId,
              availabilityPeriodChange: Number(input.availabilityPeriodChange),
              extensionPeriodChange: Number(input.extensionPeriodChange),
              repaymentPeriodChange: Number(input.repaymentPeriodChange),
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
