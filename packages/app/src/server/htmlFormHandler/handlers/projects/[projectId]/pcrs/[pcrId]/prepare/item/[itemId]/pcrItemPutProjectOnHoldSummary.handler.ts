import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import {
  ProjectSuspensionSummarySchema,
  pcrProjectSuspensionErrorMap,
  pcrProjectSuspensionSummarySchema,
} from "@ui/pages/pcrs/suspendProject/suspendProject.zod";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { getPcrItemStatus } from "@server/repositories/projectChangeRequestRepository";

export class PcrItemPutProjectOnHoldSummaryHandler extends ZodFormHandlerBase<
  ProjectSuspensionSummarySchema,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrProjectSuspensionSummary],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: pcrProjectSuspensionSummarySchema,
      errorMap: pcrProjectSuspensionErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<ProjectSuspensionSummarySchema>> {
    return {
      form: input.form,
      suspensionStartDate:
        !input.suspensionStartDate || input.suspensionStartDate.trim() === ""
          ? null
          : new Date(input.suspensionStartDate),
      suspensionEndDate:
        !input.suspensionEndDate || input.suspensionEndDate.trim() === "" ? null : new Date(input.suspensionEndDate),
      markedAsComplete: input.markedAsComplete === "on",
    };
  }

  protected async run({
    context,
    params,
    input,
  }: {
    input: z.output<ProjectSuspensionSummarySchema>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: getPcrItemStatus(input.markedAsComplete),
    });

    return ProjectChangeRequestPrepareRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
    }).path;
  }
}
