import { IContext } from "@framework/types/IContext";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { GetAllForProjectQuery } from "@server/features/partners/getAllForProjectQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import {
  RenamePartnerSchema,
  getRenamePartnerSchema,
  renamePartnerErrorMap,
} from "@ui/pages/pcrs/renamePartner/renamePartner.zod";

import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { isNil } from "lodash";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export class PcrItemChangeRenamePartnerHandler extends ZodFormHandlerBase<
  RenamePartnerSchema,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrRenamePartnerStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({ context, input }: { context: IContext; input: z.input<RenamePartnerSchema> }) {
    const partners = await context.runQuery(new GetAllForProjectQuery(input.projectId as ProjectId));

    return {
      schema: getRenamePartnerSchema(partners),
      errorMap: renamePartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<RenamePartnerSchema>> {
    return {
      form: input.form,
      projectId: input.projectId,
      pcrId: input.pcrId,
      pcrItemId: input.pcrItemId,
      partnerId: input.partnerId ?? null,
      accountName: input.accountName,
      markedAsComplete: input.markedAsComplete === "on",
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<RenamePartnerSchema>;
    context: IContext;
    params: { step?: number };
  }): Promise<string> {
    await context.runCommand(
      new UpdatePCRCommand({
        projectId: input.projectId,
        projectChangeRequestId: input.pcrId,
        pcr: {
          projectId: input.projectId,
          id: input.pcrId,
          items: [
            {
              id: input.pcrItemId,
              accountName: input.accountName,
              partnerId: input.partnerId,
              ...(!isNil(params.step) ? { status: PCRItemStatus.Incomplete } : {}),
            },
          ],
        },
      }),
    );

    return PCRPrepareItemRoute.getLink({
      projectId: input.projectId,
      pcrId: input.pcrId,
      itemId: input.pcrItemId,
      step: isNil(params.step) ? undefined : Number(params.step) + 1,
    }).path;
  }
}
