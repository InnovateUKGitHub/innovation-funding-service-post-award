import { IContext } from "@framework/types/IContext";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { isNil } from "lodash";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import {
  RemovePartnerSchema,
  removePartnerSchema,
  removePartnerErrorMap,
} from "@ui/pages/pcrs/removePartner/removePartner.zod";

export class PcrItemChangeRemovePartnerHandler extends ZodFormHandlerBase<
  RemovePartnerSchema,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrRemovePartnerStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({}: { params: ProjectChangeRequestPrepareItemParams }) {
    return {
      schema: removePartnerSchema,
      errorMap: removePartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<RemovePartnerSchema>> {
    return {
      numberOfPeriods: Number(input.numberOfPeriods),
      form: input.form,
      partnerId: input.partnerId ?? null,
      removalPeriod: input.removalPeriod || null,
      markedAsComplete: input.markedAsComplete === "on",
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<RemovePartnerSchema>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams & { step?: number };
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
              removalPeriod: input.removalPeriod,
              partnerId: input.partnerId,
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
      step: isNil(params.step) ? undefined : Number(params.step) + 1,
    }).path;
  }
}
