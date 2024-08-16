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
  ProjectSuspensionSchema,
  pcrProjectSuspensionErrorMap,
  pcrProjectSuspensionSchema,
} from "@ui/containers/pages/pcrs/suspendProject/suspendProject.zod";
import { combineDate } from "@ui/components/atoms/Date";

export class PcrItemPutProjectOnHoldHandler extends ZodFormHandlerBase<
  ProjectSuspensionSchema,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrProjectSuspensionStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: pcrProjectSuspensionSchema,
      errorMap: pcrProjectSuspensionErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<ProjectSuspensionSchema>> {
    return {
      form: input.form,
      suspensionStartDate_month: input.suspensionStartDate_month,
      suspensionStartDate_year: input.suspensionStartDate_year,
      suspensionEndDate_month: input.suspensionEndDate_month,
      suspensionEndDate_year: input.suspensionEndDate_year,
      suspensionEndDate: "",
      suspensionStartDate: "",
      markedAsComplete: input.markedAsComplete === "on",
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<ProjectSuspensionSchema>;
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
              suspensionStartDate: combineDate(input.suspensionStartDate_month, input.suspensionStartDate_year, true),
              suspensionEndDate: combineDate(input.suspensionEndDate_month, input.suspensionEndDate_year, false),
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
