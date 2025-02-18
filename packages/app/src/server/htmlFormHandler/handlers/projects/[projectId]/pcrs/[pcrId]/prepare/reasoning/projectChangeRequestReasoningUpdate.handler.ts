import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import {
  PcrReasoningFilesSchema,
  PcrReasoningSchema,
  PcrReasoningSummarySchema,
  pcrReasoningErrorMap,
  pcrReasoningFilesSchema,
  pcrReasoningSchema,
  pcrReasoningSummarySchema,
} from "@ui/pages/pcrs/reasoning/pcrReasoning.zod";
import {
  PCRPrepareReasoningRoute,
  ProjectChangeRequestPrepareReasoningParams,
} from "@ui/pages/pcrs/reasoning/pcrReasoningWorkflow.page";
import { reasoningWorkflowSteps } from "@ui/pages/pcrs/reasoning/workflowMetadata";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class ProjectChangeRequestReasoningUpdateHandler extends ZodFormHandlerBase<
  PcrReasoningSchema | PcrReasoningSummarySchema | PcrReasoningFilesSchema,
  ProjectChangeRequestPrepareReasoningParams
> {
  constructor() {
    super({
      routes: [PCRPrepareReasoningRoute],
      forms: [
        FormTypes.PcrPrepareReasoningStep,
        FormTypes.PcrPrepareReasoningSummary,
        FormTypes.PcrPrepareReasoningFilesStep,
      ],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({ input }: { input: AnyObject }) {
    if (input.form === FormTypes.PcrPrepareReasoningSummary) {
      return {
        schema: pcrReasoningSummarySchema,
        errorMap: pcrReasoningErrorMap,
      };
    } else if (input.form === FormTypes.PcrPrepareReasoningStep) {
      return {
        schema: pcrReasoningSchema,
        errorMap: pcrReasoningErrorMap,
      };
    } else {
      return {
        schema: pcrReasoningFilesSchema,
        errorMap: pcrReasoningErrorMap,
      };
    }
  }

  protected async mapToZod({
    input,
  }: {
    input: AnyObject;
  }): Promise<z.input<PcrReasoningSchema | PcrReasoningSummarySchema | PcrReasoningFilesSchema>> {
    if (input.form === FormTypes.PcrPrepareReasoningStep) {
      return {
        form: input.form,
        reasoningComments: input.reasoningComments ?? "",
      };
    } else if (input.form === FormTypes.PcrPrepareReasoningFilesStep) {
      return {
        form: input.form,
      };
    }
    return {
      form: input.form,
      markedAsComplete: input.markedAsComplete === "on",
    };
  }

  private isSummary(
    output: z.output<PcrReasoningSchema> | z.output<PcrReasoningSummarySchema> | z.output<PcrReasoningFilesSchema>,
  ): output is z.output<PcrReasoningSummarySchema> {
    return output.form === FormTypes.PcrPrepareReasoningSummary;
  }

  private isReasonStep(
    output: z.output<PcrReasoningSchema> | z.output<PcrReasoningSummarySchema> | z.output<PcrReasoningFilesSchema>,
  ): output is z.output<PcrReasoningSchema> {
    return output.form === FormTypes.PcrPrepareReasoningStep;
  }

  private isFilesStep(
    output: z.output<PcrReasoningSchema> | z.output<PcrReasoningSummarySchema> | z.output<PcrReasoningFilesSchema>,
  ): output is z.output<PcrReasoningFilesSchema> {
    return output.form === FormTypes.PcrPrepareReasoningFilesStep;
  }

  protected async run({
    input,
    params,
    context,
  }: {
    input: z.output<PcrReasoningSchema> | z.output<PcrReasoningSummarySchema> | z.output<PcrReasoningFilesSchema>;
    params: ProjectChangeRequestPrepareReasoningParams;
    context: IContext;
  }): Promise<string> {
    if (this.isReasonStep(input)) {
      await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: params.pcrId,
        Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
        Acc_Reasoning__c: input.reasoningComments,
      });
    } else if (this.isFilesStep(input)) {
      await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: params.pcrId,
        Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      });
    } else if (this.isSummary(input)) {
      await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: params.pcrId,
        Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(
          input.markedAsComplete ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
        ),
      });
    }

    // If on the summary
    if (input.form === FormTypes.PcrPrepareReasoningSummary) {
      // go back to the prepare page
      return ProjectChangeRequestPrepareRoute.getLink({
        projectId: params.projectId,
        pcrId: params.pcrId,
      }).path;
    }
    // If on the last step go to the summary
    // If not on the last step go to the next step
    return PCRPrepareReasoningRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      step: Number(params.step) === reasoningWorkflowSteps.length ? undefined : Number(params.step) + 1,
    }).path;
  }
}

export { ProjectChangeRequestReasoningUpdateHandler };
