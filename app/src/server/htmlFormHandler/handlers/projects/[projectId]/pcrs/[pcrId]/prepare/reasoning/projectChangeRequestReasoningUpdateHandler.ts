import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { ProjectChangeRequestPrepareRoute } from "@ui/containers/pages/pcrs/overview/projectChangeRequestPrepare.page";
import {
  PcrReasoningFilesSchema,
  PcrReasoningSchema,
  PcrReasoningSummarySchema,
  pcrReasoningErrorMap,
  pcrReasoningFilesSchema,
  pcrReasoningSchema,
  pcrReasoningSummarySchema,
} from "@ui/containers/pages/pcrs/reasoning/pcrReasoning.zod";
import {
  PCRPrepareReasoningRoute,
  ProjectChangeRequestPrepareReasoningParams,
} from "@ui/containers/pages/pcrs/reasoning/pcrReasoningWorkflow.page";
import { reasoningWorkflowSteps } from "@ui/containers/pages/pcrs/reasoning/workflowMetadata";
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

  protected async getZodSchema({ params }: { params: { step?: number } }) {
    if (!params.step) {
      return {
        schema: pcrReasoningSummarySchema,
        errorMap: pcrReasoningErrorMap,
      };
    } else if (Number(params.step) === 1) {
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
    params,
  }: {
    input: AnyObject;
    params: { step?: number };
  }): Promise<z.input<PcrReasoningSchema | PcrReasoningSummarySchema | PcrReasoningFilesSchema>> {
    if (Number(params.step) === 1) {
      return {
        form: input.form,
        markedAsComplete: input.markedAsComplete === "true",
        reasoningComments: input.reasoningComments ?? "",
      };
    } else if (Number(params.step) === 2) {
      return {
        form: input.form,
      };
    }
    return {
      form: input.form,
      reasoningComments: input.reasoningComments ?? "",
      reasoningStatus: input.reasoningStatus === "on",
    };
  }

  protected async run({
    input,
    params,
    context,
  }: {
    input: z.output<PcrReasoningSchema | PcrReasoningSummarySchema | PcrReasoningFilesSchema>;
    params: ProjectChangeRequestPrepareReasoningParams;
    context: IContext;
  }): Promise<string> {
    if (input.form === FormTypes.PcrPrepareReasoningStep) {
      await context.runCommand(
        new UpdatePCRCommand({
          projectId: params.projectId,
          projectChangeRequestId: params.pcrId,
          pcr: {
            projectId: params.projectId,
            id: params.pcrId,
            reasoningComments: input.reasoningComments ?? "",
            reasoningStatus: PCRItemStatus.Incomplete,
          },
        }),
      );
    } else if (input.form === FormTypes.PcrPrepareReasoningSummary) {
      await context.runCommand(
        new UpdatePCRCommand({
          projectId: params.projectId,
          projectChangeRequestId: params.pcrId,
          pcr: {
            projectId: params.projectId,
            id: params.pcrId,
            reasoningStatus: input.reasoningStatus ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
            reasoningComments: input.reasoningComments ?? "",
          },
        }),
      );
    } else {
      new UpdatePCRCommand({
        projectId: params.projectId,
        projectChangeRequestId: params.pcrId,
        pcr: {
          projectId: params.projectId,
          id: params.pcrId,
          reasoningStatus: PCRItemStatus.Incomplete,
        },
      });
    }

    // If on the summary
    if (!params.step) {
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
