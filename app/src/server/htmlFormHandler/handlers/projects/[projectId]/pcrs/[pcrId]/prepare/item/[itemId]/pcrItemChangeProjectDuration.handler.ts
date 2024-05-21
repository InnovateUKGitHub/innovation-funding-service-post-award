import { IContext } from "@framework/types/IContext";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";

import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  PCRPrepareItemRoute,
  ProjectChangeRequestPrepareItemParams,
} from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";

import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { isNil } from "lodash";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import {
  TimeExtensionSchema,
  pcrTimeExtensionSchema,
  errorMap,
} from "@ui/containers/pages/pcrs/timeExtension/timeExtension.zod";

export class PcrChangeDurationHandler extends ZodFormHandlerBase<
  TimeExtensionSchema,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrChangeDurationStep],
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
    input,
    context,
    params,
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
              offsetMonths: Number(input.timeExtension),
              ...(!isNil(params.step) ? { status: PCRItemStatus.Incomplete } : {}),
            },
          ],
        },
      }),
    );

    return PCRPrepareItemRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      step: undefined,
    }).path;
  }
}
