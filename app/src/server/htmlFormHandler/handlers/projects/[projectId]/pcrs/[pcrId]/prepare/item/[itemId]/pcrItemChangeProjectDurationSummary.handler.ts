import { IContext } from "@framework/types/IContext";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";

import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";

import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { TimeExtensionSchema, pcrTimeExtensionSchema, errorMap } from "@ui/pages/pcrs/timeExtension/timeExtension.zod";

export class PcrChangeDurationSummaryHandler extends ZodFormHandlerBase<
  TimeExtensionSchema,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrChangeDurationSummary],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: pcrTimeExtensionSchema,
      errorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<TimeExtensionSchema>> {
    return {
      form: input.form,
      timeExtension: input.timeExtension,
      markedAsComplete: input.markedAsComplete === "on",
    };
  }

  protected async run({
    context,
    params,
    input,
  }: {
    input: z.output<TimeExtensionSchema>;
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
